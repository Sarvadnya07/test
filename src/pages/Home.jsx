import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Why Education Matters
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Unlock your potential through structured learning, study habits, and clear career pathways.
            Start your journey today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/study-habits" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Learn Study Habits
            </Link>
            <Link to="/pathways" className="btn-secondary border-white text-white hover:bg-white/10">
              Explore Careers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Career Paths</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Resources</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">Study Habits</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn effective study techniques, time management, and printable trackers to maximize your learning.
              </p>
              <Link to="/study-habits" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
                Learn More →
              </Link>
            </div>
            
            <div className="card">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold mb-2">Career Pathways</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore structured roadmaps for careers like Doctor, Engineer, Lawyer, and more with clear stages and tasks.
              </p>
              <Link to="/pathways" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
                Explore →
              </Link>
            </div>
            
            <div className="card">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-2">AI Mentor</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get personalized study plans, career guidance, and answers to your questions powered by Gemini AI.
              </p>
              <Link to="/ai" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
                Try AI →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!currentUser && (
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8">Join thousands of students building their future</p>
            <Link to="/auth/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

