const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// -----------------------------
// Rate Limiting (memory)
// -----------------------------
const rateLimitMap = new Map();

function checkRateLimit(uid) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const existing = rateLimitMap.get(uid) || [];
  const recent = existing.filter(t => now - t < windowMs);

  if (recent.length >= maxRequests) {
    throw new functions.https.HttpsError(
      "resource-exhausted",
      "Rate limit exceeded. Try again later."
    );
  }

  recent.push(now);
  rateLimitMap.set(uid, recent);
}

// -----------------------------
// Helpers
// -----------------------------

// Fallback plan parser
function parsePlanFromText(text) {
  const weeks = [];
  const weekMatches = text.match(/week\s+(\d+)/gi);

  if (weekMatches && weekMatches.length) {
    weekMatches.forEach((_, i) => {
      weeks.push({
        week: i + 1,
        goals: ["Review weekly content"],
        tasks: [
          {
            title: "Weekly study blocks",
            minutes: 300,
            description: "Follow structured learning tasks"
          }
        ]
      });
    });
  } else {
    // Default 6-week fallback
    for (let i = 1; i <= 6; i++) {
      weeks.push({
        week: i,
        goals: ["Complete weekly objectives"],
        tasks: [
          {
            title: "Study tasks",
            minutes: 300,
            description: "Follow the recommended plan"
          }
        ]
      });
    }
  }
  return { weeks };
}

// Extract JSON from mixed text reliably
function extractJson(text) {
  try {
    // Match first { ... }
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

// -----------------------------
// AI Dispatch Callable
// -----------------------------
exports.aiDispatch = functions.runWith({ timeoutSeconds: 45 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign-in required.");
  }

  const { task, input, context: ctx } = data || {};
  if (!task || typeof input !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "task and input required.");
  }

  // Rate limit
  checkRateLimit(context.auth.uid);

  // API Key resolution
  const geminiApiKey =
    functions.config().gemini?.api_key || process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new functions.https.HttpsError("internal", "Gemini API key missing.");
  }

  // Personalized context
  const userProgress = ctx?.userProgress || {};
  const userContextStr =
    userProgress?.completedRoles?.length
      ? `The user has completed roles: ${userProgress.completedRoles.join(", ")}. `
      : "";

  // Base system prompt
  const systemContext =
    "You are Pathways' AI Career Mentor. Be accurate, friendly, structured, and helpful. ";

  // Prompt builder
  let prompt = "";
  switch (task) {
    case "qna":
      prompt = `${systemContext}${userContextStr}Answer simply and clearly: ${input}`;
      break;

    case "plan":
      prompt = `${systemContext}Create a 6-week detailed learning plan for: ${input}. 
Return ONLY JSON in this exact format:

{
  "weeks": [
    {
      "week": 1,
      "goals": ["goal1", "goal2"],
      "tasks": [
        {"title": "Task name", "minutes": 60, "description": "Task description"}
      ]
    }
  ]
}

Provide actionable steps and realistic timing.`;
      break;

    case "explain":
      prompt = `${systemContext}Explain this skill at beginner level: ${input}.
Use this structure:
1. What it is
2. Why it matters
3. Key concepts
4. Steps to get started
Use simple examples.`;
      break;

    case "recommend":
      prompt = `${systemContext}${userContextStr}Recommend 3–5 career paths based on: ${input}.
For each, include:
- Title
- Summary
- Key skills
- Requirements
- Salary range
- Growth
Return as structured text or JSON.`;
      break;

    case "compare":
      prompt = `${systemContext}Compare these careers: ${input}.
Include:
- Education
- Skills
- Salary
- Work-life balance
- Career growth
Keep concise and structured.`;
      break;

    default:
      prompt = `${systemContext}${userContextStr}${input}`;
  }

  try {
    // Fetch Gemini API
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    const answer = { answer: text };

    // -----------------------------
    // PLAN: Extract JSON or fallback
    // -----------------------------
    if (task === "plan") {
      const parsed = extractJson(text);
      if (parsed?.weeks) {
        answer.plan = parsed;
      } else {
        answer.plan = parsePlanFromText(text);
      }
    }

    // -----------------------------
    // RECOMMEND: Extract JSON array or fallback
    // -----------------------------
    if (task === "recommend") {
      const parsed = extractJson(text);
      if (Array.isArray(parsed)) {
        answer.recommendations = parsed;
      } else if (parsed?.recommendations) {
        answer.recommendations = parsed.recommendations;
      } else {
        answer.recommendations = null;
      }
    }

    // Log usage
    await admin.firestore().collection("aiUsage").add({
      uid: context.auth.uid,
      task,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return answer;
  } catch (error) {
    console.error("AI Dispatch Error:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "AI service failure"
    );
  }
});

// -----------------------------
// ADMIN FUNCTIONS
// -----------------------------
async function requireAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }

  const doc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  if (!doc.exists || doc.data()?.role !== "ADMIN") {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }
}

exports.adminCreateRole = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);

  const { slug, roleData } = data || {};
  if (!slug || !roleData) {
    throw new functions.https.HttpsError("invalid-argument", "slug and roleData required");
  }

  await admin.firestore().doc(`roles/${slug}`).set({
    ...roleData,
    createdBy: context.auth.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});

exports.adminUpsertStage = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);

  const { roleSlug, stage } = data || {};
  if (!roleSlug || !stage?.id) {
    throw new functions.https.HttpsError("invalid-argument", "roleSlug and stage.id required");
  }

  await admin.firestore()
    .doc(`roles/${roleSlug}/stages/${stage.id}`)
    .set(stage, { merge: true });

  return { success: true };
});

exports.adminUpsertTask = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);

  const { roleSlug, stageId, task } = data || {};
  if (!roleSlug || !stageId || !task?.id) {
    throw new functions.https.HttpsError("invalid-argument", "roleSlug, stageId, task.id required");
  }

  await admin.firestore()
    .doc(`roles/${roleSlug}/stages/${stageId}/tasks/${task.id}`)
    .set(task, { merge: true });

  return { success: true };
});

// -----------------------------
// Mentor: Propose Draft
// -----------------------------
exports.mentorProposeDraft = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }

  const doc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  const role = doc.data()?.role;

  if (role !== "MENTOR" && role !== "ADMIN") {
    throw new functions.https.HttpsError("permission-denied", "Mentor or Admin only");
  }

  if (!data) {
    throw new functions.https.HttpsError("invalid-argument", "draft required");
  }

  await admin.firestore().collection("drafts").add({
    ...data,
    createdBy: context.auth.uid,
    status: "PENDING",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});
