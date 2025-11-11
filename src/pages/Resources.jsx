import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadResources();
  }, [filter]);

  async function loadResources() {
    try {
      let q = query(collection(db, 'resources'), where('approved', '==', true));
      if (filter !== 'all') {
        q = query(collection(db, 'resources'), where('approved', '==', true), where('kind', '==', filter));
      }
      
      const snapshot = await getDocs(q);
      const res = [];
      snapshot.forEach((doc) => {
        res.push({ id: doc.id, ...doc.data() });
      });
      setResources(res);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  }

  const downloadResource = async (resource) => {
    if (resource.storagePath) {
      try {
        const url = await getDownloadURL(ref(storage, resource.storagePath));
        window.open(url, '_blank');
      } catch (error) {
        console.error('Download error:', error);
      }
    } else if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Download posters, worksheets, and access curated learning materials
      </p>

      {/* Filters */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
        >
          All
        </button>
        <button
          onClick={() => setFilter('poster')}
          className={filter === 'poster' ? 'btn-primary' : 'btn-secondary'}
        >
          Posters
        </button>
        <button
          onClick={() => setFilter('worksheet')}
          className={filter === 'worksheet' ? 'btn-primary' : 'btn-secondary'}
        >
          Worksheets
        </button>
        <button
          onClick={() => setFilter('article')}
          className={filter === 'article' ? 'btn-primary' : 'btn-secondary'}
        >
          Articles
        </button>
        <button
          onClick={() => setFilter('video')}
          className={filter === 'video' ? 'btn-primary' : 'btn-secondary'}
        >
          Videos
        </button>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <p>No resources available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="card">
              <div className="text-4xl mb-3">
                {resource.kind === 'poster' && '🖼️'}
                {resource.kind === 'worksheet' && '📄'}
                {resource.kind === 'article' && '📰'}
                {resource.kind === 'video' && '🎥'}
                {resource.kind === 'book' && '📚'}
                {resource.kind === 'course' && '🎓'}
              </div>
              <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
              {resource.source && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Source: {resource.source}
                </p>
              )}
              <button
                onClick={() => downloadResource(resource)}
                className="btn-primary w-full mt-4"
              >
                {resource.kind === 'video' ? 'Watch' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

