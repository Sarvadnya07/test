/**
 * Gemini API Integration Module
 * Provides optional AI responses using Google Gemini API
 * Falls back to local responses if API key not provided or API fails
 */

// /js/gemini.js
(function (global) {
  // ✅ Prevent re-definition if script is loaded twice
  if (global.GeminiAPI) {
    console.log("ℹ️ GeminiAPI already exists, skipping re-init");
    return;
  }

  const GeminiAPI = {
    apiKey: null,
    model: "gemini-1.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",

    /**
     * Initialize with API key from CONFIG or localStorage
     */
    init() {
      try {
        const cfg = global.CONFIG;

        // Prefer config.js value
        if (
          cfg &&
          cfg.GEMINI_API_KEY &&
          cfg.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE"
        ) {
          this.apiKey = cfg.GEMINI_API_KEY.trim();
        } else if (global.localStorage) {
          // Fallback: manually stored key
          const savedKey = global.localStorage.getItem("gemini_api_key");
          if (savedKey) {
            this.apiKey = savedKey.trim();
          }
        }

        console.log(
          "🔹 Gemini: init →",
          this.isConfigured() ? "configured" : "NO KEY"
        );
      } catch (e) {
        console.error("❌ Gemini init error:", e);
      }
    },

    /**
     * Manually set API key (if you ever add a settings page)
     */
    setApiKey(key) {
      if (key && key.trim()) {
        this.apiKey = key.trim();
        try {
          if (global.localStorage) {
            global.localStorage.setItem("gemini_api_key", this.apiKey);
          }
        } catch (_) {}
        return true;
      }
      return false;
    },

    /**
     * Clear stored key
     */
    removeApiKey() {
      this.apiKey = null;
      try {
        if (global.localStorage) {
          global.localStorage.removeItem("gemini_api_key");
        }
      } catch (_) {}
    },

    /**
     * Is key configured?
     */
    isConfigured() {
      return !!this.apiKey;
    },

    /**
     * Obfuscated status for debugging in console
     */
    getStatus() {
      return {
        configured: this.isConfigured(),
        apiKey: this.apiKey
          ? this.apiKey.substring(0, 5) +
            "..." +
            this.apiKey.substring(this.apiKey.length - 5)
          : null,
      };
    },

    /**
     * Low-level Gemini API call
     */
    async callAPI(prompt, systemPrompt = "") {
      if (!this.apiKey) {
        console.error("❌ Gemini API Error: API key not configured");
        throw new Error("API key not configured");
      }

      const fullPrompt = systemPrompt
        ? systemPrompt + "\n\n" + prompt
        : prompt;

      console.log("🚀 Calling Gemini API…");
      console.log("📋 Model:", this.model);

      const res = await fetch(
        this.baseUrl + "/" + this.model + ":generateContent?key=" + this.apiKey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 2048,
              topP: 0.9,
            },
          }),
        }
      );

      console.log("📡 Response status:", res.status, res.statusText);

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (_) {}
        console.error("❌ Gemini API error body:", errorData);
        const msg =
          (errorData.error && errorData.error.message) ||
          "HTTP " + res.status + ": " + res.statusText;
        throw new Error(msg);
      }

      const data = await res.json();
      const text =
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
          ? data.candidates[0].content.parts[0].text
          : "No response from Gemini";

      console.log("✅ Gemini API Success, length:", text.length);
      return text;
    },

    // ---------------- High-level helpers ----------------

    /**
     * General career advice
     */
    async generateCareerAdvice(question) {
      const systemPrompt =
        "You are a practical career advisor. First, if the user's question lacks context, ask one clarifying question. Otherwise, provide a clear, actionable answer tailored to the user's career question. Include 3 short, prioritized next steps and one short resource or tool recommendation. Keep the reply concise (6-8 sentences).";
      return this.callAPI(question, systemPrompt);
    },

    /**
     * 6-week learning plan generator
     */
    async generateLearningPlan(topic) {
      const systemPrompt =
        "You are an experienced learning path designer. Produce a 6-week, step-by-step plan for the learner. For each week include: Focus, 3 tasks with estimated time, and a suggested resource. Use bullet lists and short actionable items. Keep the plan realistic for a learner spending about 6-10 hours per week.";
      return this.callAPI(
        "Create a 6-week learning plan for: " + topic,
        systemPrompt
      );
    },

    /**
     * Skill explainer
     */
    async explainSkill(skillName) {
      const systemPrompt =
        "You are an educator. Explain the skill in four short sections: 1) concise definition (1-2 sentences), 2) primary real-world uses (2-3 bullets), 3) practical learning path (3 steps), 4) time-to-proficiency estimate. Use beginner-friendly language and examples.";
      return this.callAPI("Explain: " + skillName, systemPrompt);
    },

    /**
     * Career recommender
     */
    async recommendCareers(interests) {
      const systemPrompt =
        "You are a career counselor. Given the user's interests, recommend 3 relevant career paths. For each, provide: Job title (1 line), 4 required skills (short list), typical salary range (rough estimate is fine), and time-to-proficiency. End with a short note on first steps.";
      return this.callAPI(
        "My interests: " +
          interests +
          "\n\nRecommend suitable career paths for me.",
        systemPrompt
      );
    },

    /**
     * Compare two careers/skills
     */
    async compare(item1, item2) {
      const systemPrompt =
        "You are a comparison expert. Provide a concise side-by-side comparison: 1) Key differences (3 bullets), 2) Pros and cons (short), 3) When to choose each. Keep it neutral and practical.";
      return this.callAPI(
        "Compare: " + item1 + " vs " + item2,
        systemPrompt
      );
    },
  };

  // Expose globally
  global.GeminiAPI = GeminiAPI;

  // Auto-init once DOM is ready (config.js may have run by then)
  function autoInitGemini() {
    try {
      console.log("🔹 Gemini: autoInitGemini");
      GeminiAPI.init();
      console.log("🔹 Gemini status:", GeminiAPI.getStatus());
    } catch (e) {
      console.error("❌ Gemini auto-init error:", e);
    }
  }

  if (global.document) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoInitGemini);
    } else {
      autoInitGemini();
    }
  } else {
    // Non-DOM environment (unlikely in your usage)
    autoInitGemini();
  }
})(window);
