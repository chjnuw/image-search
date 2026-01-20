// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      TMDB_READ_TOKEN: process.env.TMDB_READ_TOKEN,
      TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
  },
});
