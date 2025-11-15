(function () {
  function initHeaderWhenReady() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) {
      // Header not injected yet, try again on next frame
      requestAnimationFrame(initHeaderWhenReady);
      return;
    }

    // ---------------------
    // DOM ELEMENTS
    // ---------------------
    const userMenu = document.getElementById('user-menu');
    const signinBtn = document.getElementById('signin-btn');
    const profileMenuBtn = document.getElementById('profile-menu-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const userAvatar = document.getElementById('user-avatar');
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const userDisplayName = document.getElementById('user-display-name');
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownEmail = document.getElementById('dropdown-email');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const profileDropdownToggle = document.getElementById('profile-dropdown-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    function getDefaultAvatar() {
      return '/account_circle_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png';
    }

    function showSigninButton() {
      if (signinBtn) signinBtn.classList.remove('hidden');
      if (userMenu) userMenu.classList.add('hidden');
    }

    function showUserMenu(user) {
      if (signinBtn) signinBtn.classList.add('hidden');
      if (userMenu) userMenu.classList.remove('hidden');

      const profiles = JSON.parse(localStorage.getItem('user_profile') || '{}');
      const profile = profiles[user.uid] || {};
      const avatarUrl = profile.photoURL || getDefaultAvatar();

      if (userAvatar) {
        userAvatar.onerror = () => (userAvatar.src = getDefaultAvatar());
        userAvatar.src = avatarUrl;
      }

      if (dropdownAvatar) {
        dropdownAvatar.onerror = () => (dropdownAvatar.src = getDefaultAvatar());
        dropdownAvatar.src = avatarUrl;
      }

      const displayName = user.name || profile.name || (user.email ? user.email.split('@')[0] : 'User');
      if (userDisplayName) userDisplayName.textContent = displayName;
      if (dropdownName) dropdownName.textContent = displayName;
      if (dropdownEmail) dropdownEmail.textContent = user.email || '';

      if (profileMenuBtn) {
        profileMenuBtn.onclick = () => (window.location.href = '/profile.html');
      }
    }

    // Initialize based on session
    function initHeader() {
      // Prefer sessionManager if available
      let user = null;
      if (window.sessionManager && typeof window.sessionManager.getUser === 'function') {
        user = window.sessionManager.getUser();
      } else {
        const raw = localStorage.getItem('currentUser');
        if (raw) {
          try {
            user = JSON.parse(raw);
          } catch {
            user = null;
          }
        }
      }

      if (!user || (!user.uid && !user.email)) {
        showSigninButton();
      } else {
        showUserMenu(user);
      }
    }

    // Listen to session changes if sessionManager exists
    if (window.sessionManager && typeof window.sessionManager.onSessionChange === 'function') {
      window.sessionManager.onSessionChange((user) => {
        if (!user) {
          showSigninButton();
        } else {
          showUserMenu(user);
        }
      });
    } else {
      initHeader();
    }

    // Dropdown toggle
    if (profileDropdownToggle && profileDropdown && userMenu) {
      profileDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = profileDropdownToggle.getAttribute('aria-expanded') === 'true';
        profileDropdownToggle.setAttribute('aria-expanded', (!expanded).toString());
        profileDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) {
          profileDropdown.classList.add('hidden');
        }
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (!confirm('Sign out from your account?')) return;

        if (window.sessionManager && typeof window.sessionManager.clearSession === 'function') {
          window.sessionManager.clearSession();
        } else {
          localStorage.removeItem('currentUser');
        }

        localStorage.removeItem('local_session');
        localStorage.removeItem('user_profile');

        window.location.href = '/auth.html';
      });
    }

    // Theme toggle
    function updateThemeToggle(theme) {
      const icon = themeToggle?.querySelector('span');
      if (!icon) return;

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        icon.textContent = 'dark_mode';
      } else {
        document.documentElement.classList.remove('dark');
        icon.textContent = 'light_mode';
      }
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('app_theme', newTheme);
        updateThemeToggle(newTheme);
      });

      updateThemeToggle(localStorage.getItem('app_theme') || 'light');
    }

    // Mobile menu
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });

      mobileMenu.querySelectorAll('a').forEach((btn) =>
        btn.addEventListener('click', () => mobileMenu.classList.add('hidden'))
      );
    }
  }

  // Kick off once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderWhenReady);
  } else {
    initHeaderWhenReady();
  }
})();
