// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
  css: ["@/assets/css/global.css"],

  runtimeConfig: {
    binanceP2pUrl: process.env.BINANCE_P2P_URL,

    public: {
      apiUrl: process.env.API_URL,
    },
  },
});
