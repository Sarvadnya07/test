import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { serverTimestamp } from 'firebase/firestore';

export default function Goals() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ text: '', dueDate: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadGoals();
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem('goals');
      if (saved) {
        setGoals(JSON.parse(saved));
      }
    }
  }, [currentUser]);

  async function loadGoals() {
    if (!currentUser) return;
    
    try {
      const q = query(collection(db, 'goals', currentUser.uid, 'items'));
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setGoals(items.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
      }));
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  }

  async function addGoal() {
    if (!newGoal.text.trim()) return;

    const goalData = {
      text: newGoal.text,
      dueDate: newGoal.dueDate || null,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (currentUser) {
      try {
        await addDoc(collection(db, 'goals', currentUser.uid, 'items'), goalData);
        setNewGoal({ text: '', dueDate: '' });
        setShowForm(false);
        loadGoals();
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    } else {
      // Save to localStorage
      const goal = { id: Date.now().toString(), ...goalData, createdAt: { toMillis: () => Date.now() } };
      const updated = [...goals, goal];
      setGoals(updated);
      localStorage.setItem('goals', JSON.stringify(updated));
      setNewGoal({ text: '', dueDate: '' });
      setShowForm(false);
    }
  }

  async function toggleGoal(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    if (currentUser) {
      try {
        await updateDoc(doc(db, 'goals', currentUser.uid, 'items', goalId), {
          completed: !goal.completed,
          updatedAt: serverTimestamp()
        });
        loadGoals();
      } catch (error) {
        console.error('Error updating goal:', error);
      }
    } else {
      const updated = goals.map(g => 
        g.id === goalId ? { ...g, completed: !g.completed } : g
      );
      setGoals(updated);
      localStorage.setItem('goals', JSON.stringify(updated));
    }
  }

  async function deleteGoal(goalId) {
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'goals', currentUser.uid, 'items', goalId));
        loadGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    } else {
      const updated = goals.filter(g => g.id !== goalId);
      setGoals(updated);
      localStorage.setItem('goals', JSON.stringify(updated));
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Personal Goals</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Set and track your learning goals. {!currentUser && 'Sign in to sync across devices.'}
      </p>

      <div className="mb-6">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Add New Goal
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">New Goal</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">Goal</label>
              <input
                type="text"
                value={newGoal.text}
                onChange={(e) => setNewGoal({...newGoal, text: e.target.value})}
                placeholder="e.g., Complete Math chapter 5"
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Due Date (optional)</label>
              <input
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={addGoal} className="btn-primary">
                Add Goal
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No goals yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`card flex items-center gap-4 ${goal.completed ? 'opacity-60' : ''}`}
            >
              <input
                type="checkbox"
                checked={goal.completed || false}
                onChange={() => toggleGoal(goal.id)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className={goal.completed ? 'line-through' : ''}>{goal.text}</p>
                {goal.dueDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {goals.length > 0 && (
        <div className="mt-8 card">
          <h3 className="text-xl font-bold mb-4">Progress</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{
                width: `${(goals.filter(g => g.completed).length / goals.length) * 100}%`
              }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {goals.filter(g => g.completed).length} of {goals.length} goals completed
          </p>
        </div>
      )}
    </div>
  );
}

