import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.VITE_PORT || 5173,
    allowedHosts: ['www.tecnobus.uy', 'tecnobus.uy'],
  },
})
