import { defineEventHandler, getCookie } from 'h3'
import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  console.log('🍪 user_id cookie =', userId)

  if (!userId) {
    console.log('❌ No userId, return empty')
    return []
  }

  const [rows] = await db.query(`
    SELECT
      mg.genre_id AS genre_id,
      t.name AS genre_name,
      COUNT(*) AS score
    FROM favorites f
    JOIN movie_genre mg ON mg.movie_id = f.movie_id
    JOIN tag t ON t.tmdb_genre_id = mg.genre_id
    WHERE f.user_id = ?
    GROUP BY mg.genre_id, t.name
    ORDER BY score DESC
    LIMIT 12
  `, [userId])

  console.log('📊 query result =', rows)

  return rows
})