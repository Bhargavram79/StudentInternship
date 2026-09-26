import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use /StudentInternship/ only for production builds (GitHub Pages)
  // Use / for local development so URL is just http://localhost:5173/
  base: command === 'build' ? '/StudentInternship/' : '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
}))

