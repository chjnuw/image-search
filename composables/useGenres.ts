import { ref } from "vue";
import { $fetch } from "ofetch";

const genreMap = ref<Record<number, string>>({});
let loaded = false;

export function useGenres() {
  const loadGenres = async () => {
    if (loaded) return;

    const config = useRuntimeConfig();

    const res: any = await $fetch(
      "https://api.themoviedb.org/3/genre/movie/list",
      {
        headers: {
          Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
        },
        query: {
          language: "en-US",
        },
      }
    );

    genreMap.value = Object.fromEntries(
      res.genres.map((g: any) => [g.id, g.name])
    );

    loaded = true;
  };

  return { genreMap, loadGenres };
}
