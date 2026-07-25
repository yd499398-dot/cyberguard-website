import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // This is what compiles your v4 CSS!
  ],
  // Vercel gets '/', GitHub gets '/cyberguard-website/'
  base: process.env.VERCEL ? '/' : '/cyberguard-website/',
})
