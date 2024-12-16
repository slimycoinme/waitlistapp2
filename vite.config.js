import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://your-netlify-site.netlify.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
