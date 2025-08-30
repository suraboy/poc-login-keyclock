import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for deployment flexibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'keycloak': ['keycloak-js'],
          'router': ['react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true, // Allow external connections
    cors: true
  },
  preview: {
    port: 4173,
    host: true
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0')
  }
})
