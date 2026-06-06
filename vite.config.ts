import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { type UserConfig, defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const createAppViteConfig = (mode: string): UserConfig => ({
  base: mode === 'production' ? '/REACT/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/pages',
    }),
    react(),
  ],
});

export default defineConfig(({ mode }) => createAppViteConfig(mode));
