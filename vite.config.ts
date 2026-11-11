import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures relative paths for GitHub Pages, subdirectories, and all static hosts
  plugins: [react(), tailwindcss()],
});
