import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Production builds are served from /FarzProject/ on GitHub Pages; the dev
// server stays at the root. Override with BASE_PATH for any other host.
export default defineConfig(({ command }) => ({
  base: process.env.BASE_PATH ?? (command === 'build' ? '/FarzProject/' : '/'),
  plugins: [react()],
}))
