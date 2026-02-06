import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { movieId, genreIds } = await readBody(event)

  if (!movieId) {
    throw createError({ statusCode: 400, statusMessage: 'movieId required' })
  }

  if (!Array.isArray(genreIds)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'genreIds must be an array',
    })
  }

  // 1️⃣ favorite
  await db.query(
    'INSERT IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)',
    [userId, movieId]
  )

  // 2️⃣ movie_genre
  for (const genreId of genreIds) {
    await db.query(
      'INSERT IGNORE INTO movie_genre (movie_id, genre_id) VALUES (?, ?)',
      [movieId, genreId]
    )
  }

  return { success: true }
})
