import { getCookie } from 'h3'
import { db } from '../db'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not logged in'
    })
  }

  const [rows]: any = await db.query(
    'SELECT id, username, email, image FROM user WHERE id = ? LIMIT 1',
    [userId]
  )

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  // ✅ เพิ่ม: ดึงแท็กที่เลือกไว้
  const [tags]: any = await db.query(
    `SELECT t.id, t.name
     FROM user_tags ut
     JOIN tag t ON ut.tag_id = t.id
     WHERE ut.user_id = ?`,
    [userId]
  )

  // ✅ ส่งกลับพร้อม tags
  return {
    ...rows[0],
    tags
  }
})
