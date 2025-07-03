import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  resolve: {
    alias: {
      // Alias kaldırıldı, varsayılan lucide-react çözümlemesi kullanılacak
    }
  },
  server: {
    proxy: {
      '/api': 'https://api.lussogroupgeo.com'
    }
  }
});
