import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tanstackRouter from '@tanstack/router-plugin/vite';

const BASE_PATH = '/character';

// https://vite.dev/config/
export default defineConfig({
  base: BASE_PATH,
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/pages',
    }),
    react(),
  ],
});
