// AI-generated motivational quotes

import { callAI } from "./firebase.js";

// Cache for quotes
let quoteCache = null;
let quoteCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Get motivational quote
export async function getMotivationalQuote() {
  // Check cache
  if (quoteCache && Date.now() - quoteCacheTime < CACHE_DURATION) {
    return quoteCache;
  }
  
  try {
    // Generate quote using AI
    const result = await callAI({
      task: 'qna',
      input: 'Generate a short, inspiring motivational quote about learning and career growth. Keep it under 100 characters.',
      context: {}
    });
    
    const quote = result.data.answer || result.data.text || "Keep learning, keep growing! 🚀";
    quoteCache = quote;
    quoteCacheTime = Date.now();
    
    return quote;
  } catch (error) {
    console.error("Error generating quote:", error);
    // Fallback quotes
    const fallbackQuotes = [
      "Every expert was once a beginner. Keep learning! 🌟",
      "Your career journey starts with a single step. Take it today! 💪",
      "Learning is a treasure that will follow its owner everywhere. 📚",
      "The only way to do great work is to love what you do. ❤️",
      "Success is the sum of small efforts repeated day in and day out. 🔥"
    ];
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

// Get daily quote (cached per day)
export async function getDailyQuote() {
  const today = new Date().toDateString();
  const cached = localStorage.getItem(`dailyQuote_${today}`);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const quote = await getMotivationalQuote();
  localStorage.setItem(`dailyQuote_${today}`, JSON.stringify(quote));
  
  return quote;
}

