import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Important: base should match your repo name for GitHub Pages
export default defineConfig({
  base: '/Interior-Web-Design/',
  plugins: [react()],
})
