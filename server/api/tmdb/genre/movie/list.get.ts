export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  return await $fetch("https://api.themoviedb.org/3/genre/movie/list", {
    headers: {
      Authorization: `Bearer ${config.TMDB_READ_TOKEN}`,
    },
    query: {
      language: "en-US",
    },
  });
});