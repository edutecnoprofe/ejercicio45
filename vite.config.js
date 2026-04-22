import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ejercicio45/', // Ruta para GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Activar PWA en dev para probar notificaciones
      },
      manifest: {
        name: 'Home Gym Elite',
        short_name: 'GymElite',
        description: 'Fitness App para Google TV y Móvil',
        theme_color: '#06080F',
        background_color: '#06080F',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'https://fakeimg.pl/192x192/ff5c00/06080F?text=GYM',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://fakeimg.pl/512x512/ff5c00/06080F?text=GYM',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
