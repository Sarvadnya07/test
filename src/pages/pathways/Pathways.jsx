import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Pathways() {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const pathways = [
    {
      id: 1,
      name: 'Web Development',
      description: 'Learn to build modern web applications',
      icon: '🌐',
      stages: 5,
      duration: '6-12 months',
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      name: 'Data Science',
      description: 'Master data analysis and machine learning',
      icon: '📊',
      stages: 6,
      duration: '9-15 months',
      difficulty: 'Advanced'
    },
    {
      id: 3,
      name: 'Mobile Development',
      description: 'Create apps for iOS and Android',
      icon: '📱',
      stages: 4,
      duration: '6-10 months',
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      name: 'Cloud Computing',
      description: 'Deploy and manage applications in the cloud',
      icon: '☁️',
      stages: 4,
      duration: '4-8 months',
      difficulty: 'Advanced'
    },
    {
      id: 5,
      name: 'DevOps Engineering',
      description: 'Automate and optimize deployment pipelines',
      icon: '⚙️',
      stages: 5,
      duration: '6-9 months',
      difficulty: 'Advanced'
    },
    {
      id: 6,
      name: 'UI/UX Design',
      description: 'Design beautiful and intuitive user interfaces',
      icon: '🎨',
      stages: 4,
      duration: '3-6 months',
      difficulty: 'Beginner'
    }
  ];

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = filter === 'all' 
    ? pathways 
    : pathways.filter(p => p.difficulty === filter);

  const handleSelectPath = (pathwayId) => {
    navigate(`/pathways/${pathwayId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Pathways</h1>
          <p className="text-lg text-blue-100">Choose your career path and master in-demand skills</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setFilter(diff)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === diff
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {diff === 'all' ? 'All Levels' : diff}
            </button>
          ))}
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(pathway => (
            <div
              key={pathway.id}
              className="bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-700"
              onClick={() => handleSelectPath(pathway.id)}
            >
              <div className="text-4xl mb-3">{pathway.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{pathway.name}</h3>
              <p className="text-gray-400 mb-4">{pathway.description}</p>
              
              <div className="space-y-2 mb-4 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Stages:</span>
                  <span className="text-blue-400">{pathway.stages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-blue-400">{pathway.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pathway.difficulty === 'Beginner' ? 'bg-green-900 text-green-200' :
                    pathway.difficulty === 'Intermediate' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-red-900 text-red-200'
                  }`}>
                    {pathway.difficulty}
                  </span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                Explore Path
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
