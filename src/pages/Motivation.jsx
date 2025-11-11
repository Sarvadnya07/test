import { useState, useEffect } from 'react';
import { getDailyQuote } from '../utils/quotes';

export default function Motivation() {
  const [quote, setQuote] = useState('Loading...');

  useEffect(() => {
    getDailyQuote().then(setQuote);
  }, []);

  const stories = [
    {
      title: "From Struggling Student to Doctor",
      author: "Dr. Sarah Chen",
      story: "I failed my first biology exam. Instead of giving up, I created a study schedule, joined study groups, and used active recall techniques. Today, I'm a practicing physician helping others.",
      image: "👩‍⚕️"
    },
    {
      title: "Engineering Dreams Come True",
      author: "James Kumar",
      story: "Coming from a small town, I had limited resources. I used free online courses, practiced coding daily, and built projects. Now I work at a top tech company.",
      image: "👨‍💻"
    },
    {
      title: "Teacher's Journey",
      author: "Maria Rodriguez",
      story: "I always wanted to teach but didn't know where to start. Following a structured pathway helped me get certified and now I inspire students every day.",
      image: "👩‍🏫"
    }
  ];

  const tips = [
    "Set small, achievable goals daily",
    "Celebrate every small win",
    "Find a study buddy or mentor",
    "Take breaks and avoid burnout",
    "Visualize your future success",
    "Remember: progress > perfection"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Motivation & Inspiration</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Get inspired by success stories and motivational tips
      </p>

      {/* Daily Quote */}
      <div className="card mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 className="text-2xl font-bold mb-2">💬 Daily Inspiration</h2>
        <p className="text-xl italic">"{quote}"</p>
      </div>

      {/* Success Stories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <div key={idx} className="card">
              <div className="text-5xl mb-4">{story.image}</div>
              <h3 className="text-xl font-bold mb-2">{story.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 italic">— {story.author}</p>
              <p className="text-gray-700 dark:text-gray-300">{story.story}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Motivation Tips */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Motivation Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="card flex items-start gap-4">
              <span className="text-2xl">✓</span>
              <p className="text-lg">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

