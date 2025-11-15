/**
 * Gemini API Integration Module
 * Provides optional AI responses using Google Gemini API
 * Falls back to local responses if API key not provided or API fails
 */

const GeminiAPI = {
  apiKey: null,
  model: 'gemini-1.5-flash',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  
  /**
   * Initialize with API key from config file or localStorage
   */
  init() {
    // First try config file
    if (window.CONFIG && window.CONFIG.GEMINI_API_KEY && window.CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
      this.apiKey = window.CONFIG.GEMINI_API_KEY;
      return;
    }
    
    // Fallback to localStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      this.apiKey = savedKey;
    }
  },
  
  /**
   * Set API key
   */
  setApiKey(key) {
    if (key && key.trim()) {
      this.apiKey = key.trim();
      localStorage.setItem('gemini_api_key', key.trim());
      return true;
    }
    return false;
  },
  
  /**
   * Remove API key
   */
  removeApiKey() {
    this.apiKey = null;
    localStorage.removeItem('gemini_api_key');
  },
  
  /**
   * Check if API key is configured
   */
  isConfigured() {
    return !!this.apiKey;
  },
  
  /**
   * Get API key status
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 5)}...${this.apiKey.substring(this.apiKey.length - 5)}` : null
    };
  },
  
  /**
   * Call Gemini API
   */
  async callAPI(prompt, systemPrompt = '') {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
            body: JSON.stringify({
            contents: [{
              parts: [{
                text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
              }]
            }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1024,
              topP: 0.9
            }
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API call failed');
      }
      
      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('No response from API');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  },
  
  /**
   * Generate career advice
   */
  async generateCareerAdvice(question) {
    const systemPrompt = `You are a practical career advisor. First, if the user's question lacks context, ask one clarifying question. Otherwise, provide a clear, actionable answer tailored to the user's career question. Include 3 short, prioritized next steps and one short resource or tool recommendation. Keep the reply concise (6-8 sentences).`;
    return this.callAPI(question, systemPrompt);
  },
  
  /**
   * Generate 6-week learning plan
   */
  async generateLearningPlan(topic) {
    const systemPrompt = `You are an experienced learning path designer. Produce a 6-week, step-by-step plan for the learner. For each week include: Focus, 3 tasks with estimated time, and a suggested resource. Use bullet lists and short actionable items. Keep the plan realistic for a learner spending ~6-10 hours per week.`;
    return this.callAPI(`Create a 6-week learning plan for: ${topic}`, systemPrompt);
  },
  
  /**
   * Explain a skill or concept
   */
  async explainSkill(skillName) {
    const systemPrompt = `You are an educator. Explain the skill in four short sections: 1) concise definition (1-2 sentences), 2) primary real-world uses (2-3 bullets), 3) practical learning path (3 steps), 4) time-to-proficiency estimate. Use beginner-friendly language and examples.`;
    return this.callAPI(`Explain: ${skillName}`, systemPrompt);
  },
  
  /**
   * Recommend career paths
   */
  async recommendCareers(interests) {
    const systemPrompt = `You are a career counselor. Given the user's interests, recommend 3 relevant career paths. For each, provide: Job title (1 line), 4 required skills (short list), typical salary range (regional ranges ok), and time-to-proficiency. End with a short note on first steps.`;
    return this.callAPI(`My interests: ${interests}\n\nRecommend suitable career paths for me.`, systemPrompt);
  },
  
  /**
   * Compare two things
   */
  async compare(item1, item2) {
    const systemPrompt = `You are a comparison expert. Provide a concise side-by-side comparison for ${item1} and ${item2}: 1) Key differences (3 bullets), 2) Pros and cons (short), 3) When to choose each. Keep it neutral and practical.`;
    return this.callAPI(`Compare: ${item1} vs ${item2}`, systemPrompt);
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  window.GeminiAPI = GeminiAPI;
  GeminiAPI.init();
}
