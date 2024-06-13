// 1. Importa las utilidades de `astro:content`
import { defineCollection } from "astro:content";
// 2. Define tu colección(es)
const moviesCollection = defineCollection({
  type: "data",
  contentType: "json",
  extension: ".json",
});
const tvShowsCollection = defineCollection({
  type: "data",
  contentType: "json",
  extension: ".json",
});
// 3. Exporta un único objeto `collections` para registrar tu(s) colección(es)
//    Esta clave debe coincidir con el nombre de tu directorio de colección en "src/content"
export const collections = {
  movies: moviesCollection,
  tvShows: tvShowsCollection,
};
