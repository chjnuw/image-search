import { ref } from "vue";
import { $fetch } from "ofetch";

const genreMap = ref<Record<number, string>>({});
let loaded = false;

export function useGenres() {
  const loadGenres = async () => {
    if (loaded) return;

    const res: any = await $fetch("/api/tmdb/genre/movie/list");

    genreMap.value = Object.fromEntries(
      res.genres.map((g: any) => [g.id, g.name])
    );

    loaded = true;
  };

  return { genreMap, loadGenres };
}
