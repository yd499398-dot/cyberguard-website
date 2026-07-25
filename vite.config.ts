import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Check if we are running in Vercel's build environment
  const isVercel = process.env.VERCEL;

  return {
    plugins: [react()],
    // If Vercel, serve from root. Otherwise, serve from the GitHub repo path.
    base: isVercel ? '/' : '/cyberguard-website/',
  }
})
