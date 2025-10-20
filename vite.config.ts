import { fileURLToPath, URL } from 'node:url'

import deno from '@deno/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./packages', import.meta.url)),
    },
  },
  server: {
    cors: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
