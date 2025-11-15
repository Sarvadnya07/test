// UI utilities and shared components

// Theme management with system preference detection
export function initTheme() {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let theme = savedTheme;
  if (!theme) {
    // Auto-detect system preference
    theme = systemPrefersDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }
  
  // Apply theme both as a data attribute (legacy CSS) and as the 'dark' class
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  // Keep compatibility with other scripts that read 'app_theme'
  localStorage.setItem('app_theme', theme);
  updateThemeToggle(theme);
  
  // Watch for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('app_theme', newTheme);
        updateThemeToggle(newTheme);
      }
    });
  }
}

export function toggleTheme() {
  const currentTheme = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Apply as class for Tailwind (darkMode: 'class') and as data-theme for legacy styles
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // Save preference in both keys for compatibility
  localStorage.setItem('theme', newTheme); // primary
  localStorage.setItem('app_theme', newTheme); // compatibility
  updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    // Prefer updating a material icon inside the button if present
    const icon = toggle.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
    } else {
      // Fallback to emoji if no icon element exists
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

// Show/hide loading spinner
export function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="spinner"></div>';
  }
}

export function hideLoading(element) {
  if (element) {
    element.innerHTML = '';
  }
}

// Show toast notification
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format date
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Keyboard navigation helper
export function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Skip to main content with Alt+M
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      const main = document.querySelector('main');
      if (main) {
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// Initialize UI on page load
export function initUI() {
  initTheme();
  initKeyboardNav();
  
  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

