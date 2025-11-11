import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function StudyHabits() {
  const { currentUser } = useAuth();
  const [trackerData, setTrackerData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    subjects: [],
    notes: ''
  });

  const studyTips = [
    {
      title: "Pomodoro Technique",
      description: "Study for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer break.",
      icon: "⏱️"
    },
    {
      title: "Active Recall",
      description: "Test yourself instead of just re-reading. Use flashcards or practice questions.",
      icon: "🧠"
    },
    {
      title: "Spaced Repetition",
      description: "Review material at increasing intervals. Day 1, Day 3, Day 7, Day 14, etc.",
      icon: "📅"
    },
    {
      title: "Time Blocking",
      description: "Schedule specific times for each subject. Stick to your schedule.",
      icon: "📋"
    },
    {
      title: "Eliminate Distractions",
      description: "Put your phone away, use website blockers, find a quiet space.",
      icon: "🔇"
    },
    {
      title: "Teach Others",
      description: "Explain concepts to someone else. Teaching reinforces your own learning.",
      icon: "👥"
    }
  ];

  const handlePrintTracker = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Study Habits & Time Management</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Develop effective study habits and track your learning progress
      </p>

      {/* Study Tips */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Effective Study Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyTips.map((tip, idx) => (
            <div key={idx} className="card">
              <div className="text-4xl mb-3">{tip.icon}</div>
              <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Study Tracker */}
      <section className="mb-12">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6">Daily Study Tracker</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-2 font-semibold">Date</label>
              <input
                type="date"
                value={trackerData.date}
                onChange={(e) => setTrackerData({...trackerData, date: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-semibold">Hours Studied</label>
              <input
                type="number"
                min="0"
                max="24"
                value={trackerData.hours}
                onChange={(e) => setTrackerData({...trackerData, hours: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-semibold">Subjects Studied</label>
              <input
                type="text"
                placeholder="e.g., Math, Science, English"
                value={trackerData.subjects.join(', ')}
                onChange={(e) => setTrackerData({...trackerData, subjects: e.target.value.split(',').map(s => s.trim())})}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-semibold">Notes</label>
              <textarea
                rows="4"
                value={trackerData.notes}
                onChange={(e) => setTrackerData({...trackerData, notes: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                placeholder="What did you learn today?"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handlePrintTracker} className="btn-primary">
              📄 Print Tracker
            </button>
            {currentUser && (
              <button
                onClick={async () => {
                  try {
                    await addDoc(collection(db, 'studyLogs'), {
                      uid: currentUser.uid,
                      ...trackerData,
                      createdAt: serverTimestamp()
                    });
                    alert('Study log saved!');
                  } catch (error) {
                    console.error('Error saving:', error);
                  }
                }}
                className="btn-secondary"
              >
                💾 Save Log
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Printable Tracker */}
      <div className="hidden print:block card">
        <h2 className="text-2xl font-bold mb-4">Study Tracker - {trackerData.date}</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Time</th>
              <th className="border border-gray-300 p-2">Subject</th>
              <th className="border border-gray-300 p-2">Topic</th>
              <th className="border border-gray-300 p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <p><strong>Total Hours:</strong> {trackerData.hours}</p>
          <p><strong>Subjects:</strong> {trackerData.subjects.join(', ') || 'None'}</p>
          {trackerData.notes && <p><strong>Notes:</strong> {trackerData.notes}</p>}
        </div>
      </div>
    </div>
  );
}

