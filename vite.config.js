import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = process.env.VITE_API_URL || 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 50998,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
