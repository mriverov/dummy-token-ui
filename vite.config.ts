import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    env: {
      VITE_TOKEN_ADDRESS: '0x1234567890abcdef1234567890abcdef12345678',
    },
  },
})
