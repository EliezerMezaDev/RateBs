// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
  css: ["@/assets/css/global.css"],

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
});
