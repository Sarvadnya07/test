import { createContext, useContext, useEffect, useState } from 'react';

// Lightweight, resilient AuthContext for development
// This avoids blocking the React tree when Firebase is not configured

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  // Start as false so the provider doesn't block rendering
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In development we avoid eager Firebase calls that can fail with placeholder config.
    // If you have a working Firebase setup, replace this with your onAuthStateChanged logic.
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isAdmin: userData?.role === 'admin',
    isMentor: userData?.role === 'mentor' || userData?.role === 'admin',
    isStudent: !userData || userData?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
