import { db } from '../db'
import { getCookie, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not logged in'
    })
  }

  await db.query('DELETE FROM user WHERE id = ?', [userId])

  // 🔥 สำคัญมาก
  deleteCookie(event, 'user_id', { path: '/' })

  return { success: true }
})
