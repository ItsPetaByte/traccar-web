import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({ path: '.env.dev.local' });
/* eslint-disable no-template-curly-in-string */
export default defineConfig(() => ({
  server: {
    port: 3000,
    proxy: {
      '/api/socket': `ws://${process.env.APP_DOMAIN}:8082`,
      '/api': `https://${process.env.APP_DOMAIN}`,
      '/axelor-api': {
        target: `http://${process.env.APP_AXE_DOMAIN}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/axelor-api/, ''),
      },
    },
  },
  define: {
    'import.meta.env.APP_AXE_DOMAIN': JSON.stringify(`https://${process.env.APP_AXE_DOMAIN}`),
  },
  build: {
    outDir: '../../modern',
  },
  plugins: [
    svgr(),
    react(),
    VitePWA({
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
      },
      manifest: {
        short_name: '${title}',
        name: '${description}',
        theme_color: '${colorPrimary}',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
}));
