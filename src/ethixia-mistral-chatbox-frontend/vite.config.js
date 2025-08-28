import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        test: path.resolve(__dirname, 'src/test-logo.html')
      }
    }
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: '@declarations',
        replacement: path.resolve(__dirname, '../declarations')
      },
      {
        find: '@backend',
        replacement: path.resolve(__dirname, '../declarations/ethixia-mistral-chatbox-backend')
      },
      { find: "@/", replacement: "/src/" },
    ],
    dedupe: ['@dfinity/agent'],
  },
  define: {
    'process.env': { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
