import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { currentUser, userData, isAdmin } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSignOut = async () => {
    // Firebase sign out will be implemented in production
    console.log('Sign out');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            EduRise
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {/* Education Awareness Links */}
            <Link 
              to="/study-habits" 
              className={isActive('/study-habits') ? 'font-semibold text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'}
            >
              Study Habits
            </Link>
            <Link 
              to="/motivation" 
              className={isActive('/motivation') ? 'font-semibold text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'}
            >
              Motivation
            </Link>
            <Link 
              to="/resources" 
              className={isActive('/resources') ? 'font-semibold text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'}
            >
              Resources
            </Link>
            <Link 
              to="/pathways" 
              className={isActive('/pathways') ? 'font-semibold text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'}
            >
              Pathways
            </Link>
            <Link 
              to="/ai" 
              className={isActive('/ai') ? 'font-semibold text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'}
            >
              AI Mentor
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-purple-600 dark:text-purple-400 hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Login
                </Link>
                <Link to="/auth/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

