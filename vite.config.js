import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://fullstack-project-9vu8.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/course': {
        target: 'https://fullstack-project-9vu8.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/enrollment': {
        target: 'https://fullstack-project-9vu8.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/student': {
        target: 'https://fullstack-project-9vu8.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/schedule': {
        target: 'https://fullstack-project-9vu8.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/oauth2': {
        target: 'https://fullstack-project-9vu8.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
