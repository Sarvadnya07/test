import { defineConfig } from 'vite';

export default defineConfig({
  // Removed React plugin - using vanilla JS with HTML pages
  server: {
    port: 3000,
    open: true,
    middlewareMode: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Properly handle multiple HTML entry points
    rollupOptions: {
      input: {
        main: '/index.html'
      }
    }
  },
  // Ensure Firebase modules are properly bundled
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/functions', 'firebase/analytics']
  }
});
