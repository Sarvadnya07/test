import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function StageDetail() {
  const { id, stageId } = useParams();
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState([]);

  const stage = {
    name: 'Frontend Fundamentals',
    description: 'Master the foundations of HTML, CSS, and JavaScript to build beautiful web interfaces.',
    duration: '2-3 weeks',
    lessons: [
      {
        id: 1,
        title: 'HTML Basics & Structure',
        duration: '1 hour',
        topics: ['Semantic HTML', 'Forms', 'Accessibility']
      },
      {
        id: 2,
        title: 'CSS Styling & Layouts',
        duration: '2 hours',
        topics: ['Flexbox', 'Grid', 'Responsive Design']
      },
      {
        id: 3,
        title: 'JavaScript Fundamentals',
        duration: '3 hours',
        topics: ['Variables', 'Functions', 'DOM Manipulation']
      },
      {
        id: 4,
        title: 'Interactive Elements',
        duration: '2 hours',
        topics: ['Event Handling', 'Animations', 'Best Practices']
      }
    ],
    resources: [
      { id: 1, title: 'MDN Web Docs', type: 'Documentation', link: '#' },
      { id: 2, title: 'CSS Tricks', type: 'Blog', link: '#' },
      { id: 3, title: 'JavaScript.info', type: 'Tutorial', link: '#' }
    ],
    projects: [
      {
        id: 1,
        title: 'Personal Portfolio',
        difficulty: 'Beginner',
        description: 'Create a responsive portfolio website showcasing your skills.'
      },
      {
        id: 2,
        title: 'Interactive Landing Page',
        difficulty: 'Intermediate',
        description: 'Build a landing page with animations and interactive elements.'
      }
    ]
  };

  const toggleLesson = (lessonId) => {
    setCompletedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const progress = Math.round((completedLessons.length / stage.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/pathways/${id}`)}
            className="mb-4 text-blue-100 hover:text-white transition-colors"
          >
            ← Back to Career Path
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{stage.name}</h1>
          <p className="text-lg text-blue-100">{stage.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white">Progress</h2>
            <span className="text-blue-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Lessons */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Lessons</h2>
              <div className="space-y-4">
                {stage.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                    onClick={() => toggleLesson(lesson.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={completedLessons.includes(lesson.id)}
                          onChange={() => {}}
                          className="w-6 h-6 rounded border-gray-600 text-blue-600"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className={`text-lg font-bold mb-2 ${
                          completedLessons.includes(lesson.id) ? 'text-gray-500 line-through' : 'text-white'
                        }`}>
                          {lesson.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{lesson.duration}</p>
                        <div className="flex flex-wrap gap-2">
                          {lesson.topics.map(topic => (
                            <span
                              key={topic}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>
              <div className="space-y-4">
                {stage.projects.map(project => (
                  <div
                    key={project.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.difficulty === 'Beginner' ? 'bg-green-900 text-green-200' :
                        'bg-yellow-900 text-yellow-200'
                      }`}>
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <button className="text-purple-400 hover:text-purple-300 font-medium">
                      View Project →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Stage Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Stage Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Duration</p>
                  <p className="text-white font-medium">{stage.duration}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Lessons</p>
                  <p className="text-white font-medium">{stage.lessons.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Projects</p>
                  <p className="text-white font-medium">{stage.projects.length}</p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
              <div className="space-y-3">
                {stage.resources.map(resource => (
                  <a
                    key={resource.id}
                    href={resource.link}
                    className="block p-3 bg-gray-700 rounded hover:bg-blue-600 transition-colors"
                  >
                    <p className="text-white text-sm font-medium">{resource.title}</p>
                    <p className="text-gray-400 text-xs">{resource.type}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
