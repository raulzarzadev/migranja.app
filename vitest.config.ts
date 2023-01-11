import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['__vitest__/**/*'],
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      '@comps': path.resolve(__dirname, './components')
    }
  }
})
