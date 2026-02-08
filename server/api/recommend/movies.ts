import { $fetch } from "ofetch";
import { defineEventHandler, getCookie } from "h3";
import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const userId = getCookie(event, "user_id");

    // 🔹 ไม่ได้ล็อกอิน
    if (!userId) {
      return [];
    }

    // 🔹 ดึง tag ของ user
    const [rows]: any = await db.query(
      `
      SELECT t.tmdb_genre_id
      FROM user_tags ut
      JOIN tag t ON t.id = ut.tag_id
      WHERE ut.user_id = ?
      `,
      [userId],
    );

    console.log("user_id cookie:", userId);

    // 🔹 แปลง tag → genreIds
    const genreIds = rows.map((r: any) => r.tmdb_genre_id).filter(Boolean);

    if (!genreIds.length) return [];

    const now = Date.now();

    const genreWeights = rows.map((row: any, index: number) => {
      const hours =
        (now - new Date(row.created_at).getTime()) / (1000 * 60 * 60);

      let weight = 2;

      if (index === 0) {
        weight = 6; // อยู่มานานมาก
      } else if (hours > 48) {
        weight = 3;
      } else {
        weight = 1.5; // เพิ่งเปลี่ยน
      }

      return {
        genreId: row.tmdb_genre_id,
        weight,
        isMain: index === 0,
      };
    });

    let mainMovies: any[] = [];
    let otherMovies: any[] = [];

    for (const { genreId, weight, isMain } of genreWeights) {
      const res: any = await $fetch(
        "https://api.themoviedb.org/3/discover/movie",
        {
          headers: {
            Authorization: `Bearer ${config.TMDB_READ_TOKEN}`,
          },
          query: {
            with_genres: genreId,
            sort_by: "popularity.desc",
            language: "th-TH",
            page: Math.floor(Math.random() * 5) + 1,
          },
        },
      );

      const picked = res.results.slice(0, Math.round(weight * 3));

      if (isMain) {
        mainMovies.push(...picked);
      } else {
        otherMovies.push(...picked);
      }
    }

    const uniqueMain = Array.from(
      new Map(mainMovies.map((m) => [m.id, m])).values(),
    );

    const uniqueOther = Array.from(
      new Map(otherMovies.map((m) => [m.id, m])).values(),
    );

    // เรียงในกลุ่ม
    uniqueMain.sort((a, b) => b.popularity - a.popularity);
    uniqueOther.sort((a, b) => b.popularity - a.popularity);

    // 🔐 ล็อก 1–5
    const finalFeed = [
      ...uniqueMain.slice(0, 5), // ⭐ main tag ครองบน
      ...uniqueOther,
    ];

    return finalFeed.slice(0, 20);
  } catch (err) {
    console.error("❌ recommend movies error:", err);
    return [];
  }
});
