import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // If the user runs `npm run dev` in standard Vite, we can mock the Vercel API
    // by proxying to the Vercel dev server (which usually runs on 3000)
    // However, the best way to test Vercel functions locally is running `vercel dev`
    // which wraps this Vite project automatically.
  }
})
