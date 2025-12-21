import { db } from '../db'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not logged in'
    })
  }

  // ลบ user
  await db.query('DELETE FROM user WHERE id = ?', [userId])

  // ลบ cookie
deleteCookie(event, 'user_id')

  return { success: true }
})
