import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Education Awareness Pages
import Home from './pages/Home';
import StudyHabits from './pages/StudyHabits';
import Motivation from './pages/Motivation';
import Resources from './pages/Resources';
import Pledge from './pages/Pledge';
import Goals from './pages/Goals';
import Feedback from './pages/Feedback';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Pathways Pages
import Pathways from './pages/pathways/Pathways';
import CareerDetail from './pages/pathways/CareerDetail';
import StageDetail from './pages/pathways/StageDetail';

// Account Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

// AI
import AIChat from './pages/AIChat';

// Admin
import Admin from './pages/admin/Admin';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
            {/* Education Awareness */}
            <Route path="/" element={<Home />} />
            <Route path="/study-habits" element={<StudyHabits />} />
            <Route path="/motivation" element={<Motivation />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/pledge" element={<Pledge />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Pathways */}
            <Route path="/pathways" element={<Pathways />} />
            <Route path="/pathways/:careerSlug" element={<CareerDetail />} />
            <Route path="/pathways/:careerSlug/stage/:stageId" element={<StageDetail />} />
            
            {/* Auth */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Account */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* AI */}
            <Route path="/ai" element={<AIChat />} />
            
            {/* Admin */}
            <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

