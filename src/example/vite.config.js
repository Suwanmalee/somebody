import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  base: 'my-website/',
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest:
    {
      name: "My React PWA",
      short_name: 'ReactPWA',
      description: 'A React app with Vite + PWA',
      theme_color: '#ffffff',
      icons:
      [
        {
          src:'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src:'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src:'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        },
      ]
    }
  })
]
})
