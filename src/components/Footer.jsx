import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">EduRise</h3>
            <p className="text-sm">Education Awareness & Career Pathways Platform</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Education</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/study-habits" className="hover:text-white">Study Habits</Link></li>
              <li><Link to="/motivation" className="hover:text-white">Motivation</Link></li>
              <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
              <li><Link to="/pledge" className="hover:text-white">Pledge</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Pathways</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/pathways" className="hover:text-white">Explore Careers</Link></li>
              <li><Link to="/ai" className="hover:text-white">AI Mentor</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/feedback" className="hover:text-white">Feedback</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© 2025 EduRise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

