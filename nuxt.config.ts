// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    css: [
        // CSS file in the project
        '@/assets/css/style.css',
        // SCSS file in the project
        '@/assets/css/main.scss'
    ],
    modules: [
        '@nuxtjs/tailwindcss'
    ],
    experimental: {
      inlineSSRStyles: false,
    }
})
