import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Deployed to GitHub Pages under /FarzProject/, so assets need that prefix.
// Override with BASE_PATH=/ for any host that serves from the root.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/FarzProject/',
  plugins: [react()],
})
