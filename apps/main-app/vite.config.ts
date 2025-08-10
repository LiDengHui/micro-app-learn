import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: '.',
  base: '/',
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('micro-')
      }
    }
  })],
  server: {
    port: 8080,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
