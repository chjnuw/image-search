import { db } from '~/server/db'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) {
    return { ok: false, message: 'ยังไม่ได้ล็อกอิน' }
  }

  const [rows]: any = await db.query(
    'SELECT id, username, email, gender FROM user WHERE id = ?',
    [userId]
  )

  if (rows.length === 0) {
    return { ok: false, message: 'ไม่พบผู้ใช้' }
  }

  return {
    ok: true,
    user: rows[0]
  }
})
