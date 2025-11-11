import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext) || {};
  const [activeTab, setActiveTab] = useState('overview');

  const recentCourses = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      progress: 75,
      instructor: 'Sarah Chen',
      thumbnail: '⚛️'
    },
    {
      id: 2,
      title: 'Web Design Fundamentals',
      progress: 45,
      instructor: 'Mike Johnson',
      thumbnail: '🎨'
    },
    {
      id: 3,
      title: 'JavaScript Mastery',
      progress: 90,
      instructor: 'Alex Rodriguez',
      thumbnail: '📝'
    }
  ];

  const goals = [
    { id: 1, title: 'Complete React Course', deadline: '2025-12-31', status: 'in-progress' },
    { id: 2, title: 'Build 3 Portfolio Projects', deadline: '2025-11-30', status: 'in-progress' },
    { id: 3, title: 'Learn TypeScript', deadline: '2025-10-30', status: 'completed' }
  ];

  const achievements = [
    { id: 1, name: 'Fast Learner', icon: '⚡' },
    { id: 2, name: 'Consistent', icon: '📅' },
    { id: 3, name: 'Rising Star', icon: '⭐' },
    { id: 4, name: 'Community Helper', icon: '🤝' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.firstName || 'Learner'}!</h1>
          <p className="text-blue-100">Keep up with your learning journey</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Learning Hours</p>
            <p className="text-3xl font-bold text-blue-400">128</p>
            <p className="text-gray-500 text-xs mt-2">+12 this week</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Streak Days</p>
            <p className="text-3xl font-bold text-green-400">24</p>
            <p className="text-gray-500 text-xs mt-2">Keep it up!</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Courses Active</p>
            <p className="text-3xl font-bold text-purple-400">3</p>
            <p className="text-gray-500 text-xs mt-2">In progress</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Achievements</p>
            <p className="text-3xl font-bold text-yellow-400">12</p>
            <p className="text-gray-500 text-xs mt-2">Unlocked</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-8">
          <div className="flex border-b border-gray-700">
            {['overview', 'courses', 'goals', 'achievements'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Your Learning Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-3">This Week's Activity</p>
                    <div className="flex items-end gap-1 h-16">
                      {[40, 60, 55, 75, 65, 80, 70].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-blue-500 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-3">Time Spent by Category</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Frontend</span>
                        <span className="text-blue-400">45%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                      <div className="flex justify-between text-sm mt-4">
                        <span className="text-gray-300">Backend</span>
                        <span className="text-purple-400">35%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }} />
                      </div>
                      <div className="flex justify-between text-sm mt-4">
                        <span className="text-gray-300">Design</span>
                        <span className="text-pink-400">20%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Active Courses</h3>
                <div className="space-y-4">
                  {recentCourses.map(course => (
                    <div key={course.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{course.thumbnail}</div>
                          <div>
                            <h4 className="text-white font-bold">{course.title}</h4>
                            <p className="text-gray-400 text-sm">Instructor: {course.instructor}</p>
                          </div>
                        </div>
                        <span className="text-blue-400 font-bold">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Your Goals</h3>
                <div className="space-y-4">
                  {goals.map(goal => (
                    <div key={goal.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold">{goal.title}</h4>
                        <p className="text-gray-400 text-sm">Deadline: {goal.deadline}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        goal.status === 'completed' ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
                      }`}>
                        {goal.status === 'completed' ? '✓ Completed' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Achievements & Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="bg-gray-700 rounded-lg p-6 text-center hover:bg-gray-600 transition-colors">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <p className="text-white font-medium text-sm">{achievement.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready for a new challenge?</h3>
          <p className="text-blue-100 mb-6">Explore new learning paths and expand your skills</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Browse Pathways
          </button>
        </div>
      </div>
    </div>
  );
}
