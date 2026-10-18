import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TernStay/',
  build: {
    chunkSizeWarningLimit: 1000, // ขยายlimit เตือนเป็น 1000 kB
  },
})