import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/PrimeTrade/',
  plugins: [react()],
  server: {
    port: 5173,
  },
});
