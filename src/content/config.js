import { defineCollection, z } from "astro:content";
const moviesCollection = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      genre: z.string(),
      movies: z.array(
        z.object({
          title: z.string().optional(),
          id: z.number(),
        })
      ),
    })
  ),
});
const tvShowsCollection = defineCollection({
  type: "data",
  // schema: z.array(
  //   z.object({
  // title: z.string().optional(),
  //     id: z.number(),
  //   })
  // ),
});
export const collections = {
  movies: moviesCollection,
  tvShows: tvShowsCollection,
};
