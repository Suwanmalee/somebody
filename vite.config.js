import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  base: 'somebody/',
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest:
    {
      name: "somebody",
      short_name: 'someone',
      description: 'Somebody is a social connection app that helps you find people nearby who share your interests. Chat, meet, and build real connections — because there’s always somebody waiting to be found.',
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