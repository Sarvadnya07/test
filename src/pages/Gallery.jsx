import { useState } from 'react';

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const galleries = [
    { id: 1, title: 'Student Success Stories', category: 'success', desc: 'Real stories from successful learners' },
    { id: 2, title: 'Learning Milestones', category: 'achievement', desc: 'Celebrate every achievement' },
    { id: 3, title: 'Community Events', category: 'events', desc: 'Photos from our community events' },
    { id: 4, title: 'Resource Highlights', category: 'resources', desc: 'Featured learning resources' },
    { id: 5, title: 'Study Groups', category: 'community', desc: 'Join study groups in action' },
    { id: 6, title: 'Mentor Spotlights', category: 'mentors', desc: 'Meet our mentors and advisors' },
  ];

  const filteredGalleries = filter === 'all' ? galleries : galleries.filter((g) => g.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Gallery</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore inspiring stories and moments from our community
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Success Stories
          </button>
          <button
            onClick={() => setFilter('achievement')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'achievement'
                ? 'bg-yellow-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setFilter('community')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'community'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Community
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105"
            >
              {/* Placeholder Image */}
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-48 flex items-center justify-center text-white text-5xl">
                🖼️
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{item.desc}</p>
                <button className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm">
                  View Gallery →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGalleries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No galleries found for this category.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Share Your Story</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Have an inspiring story or achievement? We'd love to feature it in our gallery!
          </p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition">
            Submit Your Story
          </button>
        </div>
      </div>
    </div>
  );
}
