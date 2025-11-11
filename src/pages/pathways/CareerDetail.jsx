import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const careers = {
    1: {
      name: 'Web Development',
      description: 'Build modern, responsive web applications using the latest technologies.',
      icon: '🌐',
      salary: '$80,000 - $150,000',
      demand: 'Very High',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
      companies: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Netflix'],
      stages: [
        { id: 1, name: 'Frontend Fundamentals', duration: '2-3 weeks' },
        { id: 2, name: 'Advanced React', duration: '3-4 weeks' },
        { id: 3, name: 'Backend Development', duration: '4-5 weeks' },
        { id: 4, name: 'Full Stack Projects', duration: '4-6 weeks' },
        { id: 5, name: 'Career Preparation', duration: '2-3 weeks' }
      ]
    },
    2: {
      name: 'Data Science',
      description: 'Analyze data and build machine learning models to solve real-world problems.',
      icon: '📊',
      salary: '$100,000 - $200,000',
      demand: 'Very High',
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'TensorFlow', 'Data Visualization'],
      companies: ['Google', 'Amazon', 'Meta', 'JPMorgan', 'Tesla'],
      stages: [
        { id: 1, name: 'Python Fundamentals', duration: '3-4 weeks' },
        { id: 2, name: 'Data Analysis & Visualization', duration: '3-4 weeks' },
        { id: 3, name: 'Machine Learning Basics', duration: '4-5 weeks' },
        { id: 4, name: 'Advanced ML & Deep Learning', duration: '5-6 weeks' },
        { id: 5, name: 'Real-world Projects', duration: '4-6 weeks' },
        { id: 6, name: 'Career Preparation', duration: '2-3 weeks' }
      ]
    }
  };

  const career = careers[id] || careers[1];

  const handleStageClick = (stageId) => {
    navigate(`/pathways/${id}/stage/${stageId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/pathways')}
            className="mb-4 text-blue-100 hover:text-white transition-colors"
          >
            ← Back to Pathways
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{career.name}</h1>
          <p className="text-lg text-blue-100">{career.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Salary Range</h3>
            <p className="text-2xl font-bold text-green-400">{career.salary}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Job Market Demand</h3>
            <p className="text-2xl font-bold text-blue-400">{career.demand}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Learning Stages</h3>
            <p className="text-2xl font-bold text-purple-400">{career.stages.length}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Required Skills</h2>
          <div className="flex flex-wrap gap-3">
            {career.skills.map(skill => (
              <span
                key={skill}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Top Companies Hiring</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {career.companies.map(company => (
              <div
                key={company}
                className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700"
              >
                <p className="text-white font-medium">{company}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stages */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Learning Stages</h2>
          <div className="space-y-4">
            {career.stages.map((stage, index) => (
              <div
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-white">{stage.name}</h3>
                    <p className="text-gray-400">{stage.duration}</p>
                  </div>
                  <div className="text-gray-500">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to start this pathway?</h3>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
