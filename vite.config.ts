import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Vercel automatically sets this environment variable during deployment
  const isVercel = process.env.VERCEL === '1';

  return {
    plugins: [react()],
    // Dynamically set the base path based on the hosting platform
    base: isVercel ? '/' : '/cyberguard-website/',
  };
});
