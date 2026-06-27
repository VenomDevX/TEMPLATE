import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Preview-only Vite config. `fs.allow: ['..']` lets us import the real
// ../TextReveal.tsx that lives one level up (the single source of truth).
//
// That component sits ABOVE this folder, but node_modules is INSIDE it, so
// Node resolution (which walks up from the importing file) can't find the
// deps from there. We alias them to this preview's copies — which also pins a
// single React instance, required for Framer Motion's hooks to work.
const dep = (name: string) =>
  fileURLToPath(new URL(`./node_modules/${name}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'framer-motion': dep('framer-motion'),
      react: dep('react'),
      'react-dom': dep('react-dom'),
    },
    dedupe: ['react', 'react-dom', 'framer-motion'],
  },
  optimizeDeps: { include: ['framer-motion', 'react', 'react-dom'] },
  server: {
    host: true,
    open: false,
    fs: { allow: ['..'] },
  },
})
