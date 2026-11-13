import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: env.VITE_BASE_PATH || '/',
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3005',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, '../backend/public'),
      emptyOutDir: true,
    },
  };
});
