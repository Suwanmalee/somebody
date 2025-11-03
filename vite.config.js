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
      name: "Weather Report",
      short_name: 'AN318',
      description: 'แอบพลิเคชัน สำหรับ ดูสภาพอากาศ',
      theme_color: '#ffffff',
      icons:
      [
        {
          src:'pwa-192x192.png',
          sizes: '256x256',
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