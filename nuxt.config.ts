import path from 'node:path'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['assets/main.scss', 'vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  ssr: false,
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  nitro: {
    output: {
      dir: path.join(__dirname, 'dist'),
    },
    preset: './preset',
  },
})
