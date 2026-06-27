import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url))
const reactPath = fileURLToPath(new URL('./node_modules/react/index.js', import.meta.url))
const reactJsxRuntimePath = fileURLToPath(new URL('./node_modules/react/jsx-runtime.js', import.meta.url))
const reactJsxDevRuntimePath = fileURLToPath(new URL('./node_modules/react/jsx-dev-runtime.js', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'react/jsx-dev-runtime', replacement: reactJsxDevRuntimePath },
      { find: 'react/jsx-runtime', replacement: reactJsxRuntimePath },
      { find: 'react', replacement: reactPath },
    ],
  },
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
})
