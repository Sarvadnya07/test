import React, { useState } from 'react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Mentor', joinDate: '2024-01-10' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Student', joinDate: '2024-01-20' }
  ]);

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Active Sessions', value: '342', change: '+5%' },
    { label: 'Learning Hours', value: '12,543', change: '+23%' },
    { label: 'Completed Courses', value: '89', change: '+8%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage users, content, and platform analytics</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-green-400 text-sm">{stat.change} from last month</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            {['overview', 'users', 'content', 'settings'].map(tab => (
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

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Platform Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">User Growth</p>
                    <p className="text-white text-2xl font-bold">↗ 15% MTD</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Engagement Rate</p>
                    <p className="text-white text-2xl font-bold">↗ 23% MTD</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Join Date</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="py-4 px-4 text-white">{user.name}</td>
                          <td className="py-4 px-4 text-gray-400">{user.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Mentor' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-400">{user.joinDate}</td>
                          <td className="py-4 px-4">
                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Content Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <p className="text-gray-400 text-sm mb-2">Total Courses</p>
                    <p className="text-white text-2xl font-bold">45</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <p className="text-gray-400 text-sm mb-2">Total Lessons</p>
                    <p className="text-white text-2xl font-bold">234</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <p className="text-gray-400 text-sm mb-2">Pending Review</p>
                    <p className="text-white text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Platform Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span className="text-white">Maintenance Mode</span>
                    <input type="checkbox" className="w-5 h-5 rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span className="text-white">Email Notifications</span>
                    <input type="checkbox" className="w-5 h-5 rounded" checked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <span className="text-white">User Registration</span>
                    <input type="checkbox" className="w-5 h-5 rounded" checked />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
