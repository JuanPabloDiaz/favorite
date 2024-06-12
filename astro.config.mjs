import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: vercel(),
  vite: {
    define: {
      "process.env.TMDB_API_KEY": JSON.stringify(process.env.TMDB_API_KEY),
    },
  },
});
