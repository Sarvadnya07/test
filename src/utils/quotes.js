// Fallback quotes if AI is not available
const fallbackQuotes = [
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Don't let yesterday take up too much of today. - Will Rogers",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. - Confucius"
];

export async function getDailyQuote() {
  // Get quote based on day of year for consistency
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Use day of year to pick a consistent quote for the day
  const quoteIndex = dayOfYear % fallbackQuotes.length;
  return fallbackQuotes[quoteIndex];
}

export async function getMotivationalQuote() {
  // Return a random quote
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[randomIndex];
}
