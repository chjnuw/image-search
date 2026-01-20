import { $fetch } from "ofetch";
import { defineEventHandler, getCookie } from "h3";
import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const userId = getCookie(event, "user_id");

    // 🔹 CASE 1: ไม่ได้ล็อคอิน → popular
    if (!userId) {
      const res: any = await $fetch(
        "https://api.themoviedb.org/3/movie/popular",
        {
          headers: {
            Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
          },
          query: {
            language: "th-TH",
            page: 1,
          },
        }
      );

      return res?.results?.slice(0, 20) || [];
    }

    // 🔹 CASE 2: ล็อคอิน → tag-based
    const [rows]: any = await db.query(
      `
      SELECT t.tmdb_genre_id
      FROM user_tags ut
      JOIN tag t ON t.id = ut.tag_id
      WHERE ut.user_id = ?
      `,
      [userId]
    );

    const genreIds = rows.map((r: any) => r.tmdb_genre_id).filter(Boolean);
    if (!genreIds.length) return [];

    const perGenre = Math.ceil(20 / genreIds.length);
    const movies: any[] = [];

    for (const genreId of genreIds.slice(0, 3)) {
      const page = Math.random() < 0.4 ? 1 : Math.floor(Math.random() * 15) + 1;
      const res: any = await $fetch(
        "https://api.themoviedb.org/3/discover/movie",
        {
          headers: {
            Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
          },
          query: {
            with_genres: genreId,
            sort_by: "popularity.desc",
            language: "th-TH",
            page,
          },
        }
      );

      movies.push(...(res?.results || []).slice(0, perGenre));
    }

    const unique = Array.from(new Map(movies.map((m) => [m.id, m])).values());

    return unique.slice(0, 20);
  } catch (err) {
    console.error("❌ recommend movies error:", err);
    return [];
  }
});
