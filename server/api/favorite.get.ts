import { db } from "../db"
import { getCookie } from "h3"

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user_id")
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  const [rows] = await db.query(
    "SELECT movie_id FROM favorites WHERE user_id = ?",
    [userId]
  )

  return rows
})
