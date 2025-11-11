import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john@example.com',
    bio: 'Passionate learner and tech enthusiast',
    location: 'San Francisco, CA',
    expertise: ['Web Development', 'React', 'JavaScript']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save to database would happen here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-blue-100">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-4xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-400 mb-6">{formData.email}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Learning Hours</p>
                  <p className="text-2xl font-bold text-blue-400">128</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Courses Completed</p>
                  <p className="text-2xl font-bold text-green-400">5</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Achievements</p>
                  <p className="text-2xl font-bold text-purple-400">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Bio */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">About Me</h3>
                  <p className="text-gray-300">{formData.bio}</p>
                </div>

                {/* Location & Expertise */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📍 Location</h3>
                    <p className="text-gray-300">{formData.location}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🎯 Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.expertise.map(skill => (
                        <span key={skill} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-gray-700">
                      <p className="text-white font-medium">Completed: React Advanced Patterns</p>
                      <p className="text-gray-400 text-sm">2 days ago</p>
                    </div>
                    <div className="pb-3 border-b border-gray-700">
                      <p className="text-white font-medium">Started: Node.js Fundamentals</p>
                      <p className="text-gray-400 text-sm">1 week ago</p>
                    </div>
                    <div>
                      <p className="text-white font-medium">Earned Badge: Rising Star</p>
                      <p className="text-gray-400 text-sm">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
