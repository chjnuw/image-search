import { readBody, getCookie } from "h3"
import { db } from "../db"

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user_id")
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  const { movieId } = await readBody(event)
  if (!movieId) {
    throw createError({ statusCode: 400, statusMessage: "movieId required" })
  }

  await db.query(
    "INSERT IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)",
    [userId, movieId]
  )

  return { success: true }
})
