import { db } from "../db"
import { getCookie, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user_id")
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  const { movieId } = await readBody(event)
  if (!movieId) {
    throw createError({ statusCode: 400 })
  }

  await db.query(
    "DELETE FROM favorites WHERE user_id = ? AND movie_id = ?",
    [userId, movieId]
  )

  return { success: true }
})
