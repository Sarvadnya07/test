const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Rate limiting map (in production, use Redis or Firestore)
const rateLimitMap = new Map();

// Helper: Parse plan from text if JSON parsing fails
function parsePlanFromText(text) {
  const weeks = [];
  const weekMatches = text.match(/week\s+(\d+)/gi);
  
  if (weekMatches) {
    weekMatches.forEach((match, idx) => {
      weeks.push({
        week: idx + 1,
        goals: [],
        tasks: []
      });
    });
  } else {
    // Default 6 weeks
    for (let i = 1; i <= 6; i++) {
      weeks.push({
        week: i,
        goals: ["Complete weekly objectives"],
        tasks: [
          { title: "Weekly learning tasks", minutes: 300, description: "Follow the learning plan" }
        ]
      });
    }
  }
  
  return { weeks };
}

// Helper: Rate limit check
function checkRateLimit(uid) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;
  
  if (!rateLimitMap.has(uid)) {
    rateLimitMap.set(uid, []);
  }
  
  const requests = rateLimitMap.get(uid);
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    throw new functions.https.HttpsError(
      "resource-exhausted",
      "Rate limit exceeded. Please try again later."
    );
  }
  
  recentRequests.push(now);
  rateLimitMap.set(uid, recentRequests);
}

// AI Dispatch Callable Function
exports.aiDispatch = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign in required"
    );
  }
  
  const { task, input, context: ctx } = data || {};
  
  if (!task || !input) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "task and input are required"
    );
  }
  
  // Rate limiting
  checkRateLimit(context.auth.uid);
  
  const geminiApiKey = functions.config().gemini?.api_key || process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new functions.https.HttpsError(
      "internal",
      "Gemini API key not configured"
    );
  }
  
  // Get user context for personalized responses
  const userProgress = ctx?.userProgress || {};
  const userContextStr = userProgress.completedRoles?.length > 0 
    ? `The user has experience with: ${userProgress.completedRoles.join(', ')}. `
    : '';
  
  // Build prompt based on task type
  let prompt = "";
  let systemContext = "You are Pathways' AI career mentor. Be helpful, concise, and encouraging. ";
  
  switch (task) {
    case "qna":
      prompt = `${systemContext}${userContextStr}Answer this question about careers, skills, or learning: ${input}. Provide a clear, structured answer.`;
      break;
    case "plan":
      prompt = `${systemContext}Create a detailed 6-week learning plan for: ${input}. 
Return ONLY valid JSON in this exact format:
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
Make it practical and actionable.`;
      break;
    case "explain":
      prompt = `${systemContext}Explain this skill or concept in simple, beginner-friendly terms: ${input}. 
Break it down into:
1. What it is
2. Why it's important
3. Key concepts
4. How to get started
Use examples and analogies.`;
      break;
    case "recommend":
      prompt = `${systemContext}${userContextStr}Recommend 3-5 career paths based on: ${input}. 
For each career, provide:
- Title
- Description
- Key skills needed
- Requirements (education, experience)
- Salary range (if known)
- Growth prospects
Return as structured text or JSON.`;
      break;
    case "compare":
      prompt = `${systemContext}Compare these careers: ${input}. 
Create a detailed comparison covering:
- Education requirements
- Skills needed
- Job outlook
- Salary ranges
- Work-life balance
- Career progression
Use a clear, structured format.`;
      break;
    default:
      prompt = `${systemContext}${userContextStr}${input}`;
  }
  
  try {
    // Call Gemini API
    const { default: fetch } = await import("node-fetch");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }]
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
    
    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    
    // Process response based on task type
    let answer = { answer: text };
    
    if (task === "plan") {
      try {
        // Try to extract JSON from response
        let jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.weeks && Array.isArray(parsed.weeks)) {
            answer.plan = parsed;
          } else {
            // If structure is wrong, try to fix it
            answer.plan = { weeks: parsed.weeks || [] };
          }
        } else {
          // If no JSON, create a structured response from text
          answer.plan = parsePlanFromText(text);
        }
      } catch (e) {
        console.error("Plan parsing error:", e);
        answer.plan = parsePlanFromText(text);
      }
    } else if (task === "recommend") {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            answer.recommendations = parsed;
          } else if (parsed.recommendations) {
            answer.recommendations = parsed.recommendations;
          } else {
            answer.recommendations = [parsed];
          }
        }
      } catch (e) {
        // If JSON parsing fails, return text
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
    console.error("AI Dispatch error:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "AI service error"
    );
  }
});

// Admin: Create Role
exports.adminCreateRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }
  
  // Check admin role (would need custom claims in production)
  const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  if (userDoc.data()?.role !== "ADMIN") {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }
  
  const { slug, roleData } = data;
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

// Admin: Upsert Stage
exports.adminUpsertStage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }
  
  const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  if (userDoc.data()?.role !== "ADMIN") {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }
  
  const { roleSlug, stage } = data;
  if (!roleSlug || !stage) {
    throw new functions.https.HttpsError("invalid-argument", "roleSlug and stage required");
  }
  
  await admin.firestore()
    .doc(`roles/${roleSlug}/stages/${stage.id}`)
    .set(stage, { merge: true });
  
  return { success: true };
});

// Admin: Upsert Task
exports.adminUpsertTask = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }
  
  const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  if (userDoc.data()?.role !== "ADMIN") {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }
  
  const { roleSlug, stageId, task } = data;
  if (!roleSlug || !stageId || !task) {
    throw new functions.https.HttpsError("invalid-argument", "roleSlug, stageId, and task required");
  }
  
  await admin.firestore()
    .doc(`roles/${roleSlug}/stages/${stageId}/tasks/${task.id}`)
    .set(task, { merge: true });
  
  return { success: true };
});

// Mentor: Propose Draft
exports.mentorProposeDraft = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required");
  }
  
  const userDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  const role = userDoc.data()?.role;
  if (role !== "MENTOR" && role !== "ADMIN") {
    throw new functions.https.HttpsError("permission-denied", "Mentor or Admin only");
  }
  
  const draft = data;
  if (!draft) {
    throw new functions.https.HttpsError("invalid-argument", "draft required");
  }
  
  await admin.firestore().collection("drafts").add({
    ...draft,
    createdBy: context.auth.uid,
    status: "PENDING",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true };
});

