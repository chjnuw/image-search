import { defineEventHandler } from "h3"
import { $fetch } from "ofetch"

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()

    // genre สำหรับผู้หญิง
    const femaleGenres = [10749, 18, 35, 16] // Romance, Drama, Comedy, Animation

    const genreId =
      femaleGenres[Math.floor(Math.random() * femaleGenres.length)]

    const res: any = await $fetch(
      "https://api.themoviedb.org/3/discover/movie",
      {
        headers: {
          Authorization: `Bearer ${config.TMDB_READ_TOKEN}`,
        },
        query: {
          with_genres: genreId,
          sort_by: "popularity.desc",
          page: Math.floor(Math.random() * 10) + 1,
          language: "th-TH",
        },
      }
    )

    return res?.results?.slice(0, 12) || []
  } catch (err) {
    console.error("❌ female recommend error:", err)
    return []
  }
})