/**
 * Session Manager - Handles user session persistence across page navigation
 * Prevents logout when navigating between pages
 */

const SESSION_KEY = 'currentUser';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute

class SessionManager {
  constructor() {
    this.user = null;
    this.listeners = [];
    this.initializeSession();
    this.startSessionCheck();
  }

  /**
   * Initialize session from localStorage
   */
  initializeSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const user = JSON.parse(sessionData);
        // Validate session - if sessionStart exists, check timeout
        // If sessionStart doesn't exist (legacy format), keep the session
        if (user.sessionStart) {
          // Check if session has expired
          if (Date.now() - user.sessionStart < SESSION_TIMEOUT) {
            this.user = user;
            this.notifyListeners();
          } else {
            // Session expired
            this.clearSession();
          }
        } else {
          // Legacy format without sessionStart - keep it and add timestamp
          // This handles users saved by auth.html or other methods
          user.sessionStart = Date.now();
          user.lastActivity = Date.now();
          try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
          } catch (e) {
            console.warn('Could not update session timestamp:', e);
          }
          this.user = user;
          this.notifyListeners();
        }
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      // Don't clear session on parse errors - might be corrupted but recoverable
      // Only clear if it's completely invalid
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (e) {
        // Ignore errors clearing
      }
      this.user = null;
    }
  }

  /**
   * Save user to session
   */
  setUser(user) {
    try {
      const sessionUser = {
        ...user,
        sessionStart: Date.now(),
        lastActivity: Date.now()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      this.user = sessionUser;
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Get current user
   */
  getUser() {
    return this.user;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.user !== null;
  }

  /**
   * Clear session
   */
  clearSession() {
    localStorage.removeItem(SESSION_KEY);
    this.user = null;
    this.notifyListeners();
  }

  /**
   * Update last activity timestamp
   */
  updateActivity() {
    if (this.user) {
      this.user.lastActivity = Date.now();
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(this.user));
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    }
  }

  /**
   * Register listener for session changes
   */
  onSessionChange(callback) {
    this.listeners.push(callback);
    // Call immediately with current state
    callback(this.user);
  }

  /**
   * Remove listener
   */
  offSessionChange(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Notify all listeners of session change
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.user);
      } catch (error) {
        console.error('Error in session listener:', error);
      }
    });
  }

  /**
   * Start periodic session check
   */
  startSessionCheck() {
    setInterval(() => {
      this.initializeSession();
      this.updateActivity();
    }, SESSION_CHECK_INTERVAL);
  }

  /**
   * Get session info for debugging
   */
  getSessionInfo() {
    if (!this.user) return null;
    return {
      uid: this.user.uid,
      email: this.user.email,
      name: this.user.name,
      sessionStart: new Date(this.user.sessionStart),
      lastActivity: new Date(this.user.lastActivity),
      sessionAgeMinutes: Math.round((Date.now() - this.user.sessionStart) / 60000)
    };
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sessionManager;
}
