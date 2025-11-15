/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./auth.html",
    "./dashboard.html",
    "./learn.html",
    "./pathways.html",
    "./profile.html",
    "./settings.html",
    "./discussion.html",
    "./forum.html",
    "./gamification.html",
    "./help.html",
    "./ai.html",
    "./admin.html",
    "./roles.html",
    "./role.html",
    "./components/**/*.html",
    "./js/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}

