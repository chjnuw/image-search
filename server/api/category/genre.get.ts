export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const genre = query.genre;

  if (!genre) return [];

  const config = useRuntimeConfig();

  const res: any = await $fetch(
    "https://api.themoviedb.org/3/discover/movie",
    {
      headers: {
        Authorization: `Bearer ${config.TMDB_READ_TOKEN}`,
      },
      query: {
        with_genres: genre,
        sort_by: "popularity.desc",
        language: "th-TH",
        page: 1,
      },
    }
  );

  return res.results || [];
});