import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Automatically serve '/' for Vercel, and '/cyberguard-website/' for GitHub Pages
  base: process.env.VERCEL ? '/' : '/cyberguard-website/',
})
