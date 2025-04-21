import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/global.css'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    'shadcn-nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: '',
    fallback: 'light', 
    preference: 'system',
    dataValue: 'theme',
    storageKey: 'nuxt-color-mode',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    // cookie: {
    //   key: 'nuxt-color-mode',
    //   options: {
    //     path: '/',
    //     maxAge: 31536000, // 1 year
    //     sameSite: 'lax'
    //   }
    // }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})