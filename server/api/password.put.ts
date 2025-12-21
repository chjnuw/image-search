import { getCookie } from 'h3'
import bcrypt from 'bcrypt'
import { db } from '../db'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  console.log('PASSWORD COOKIE user_id =', userId)

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not logged in'
    })
  }

  const { oldPassword, newPassword } = await readBody(event)

  if (!oldPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required'
    })
  }

  const [rows]: any = await db.query(
    'SELECT password FROM user WHERE id = ?',
    [userId]
  )

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const match = await bcrypt.compare(oldPassword, rows[0].password)
  if (!match) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Old password incorrect'
    })
  }

  const hashed = await bcrypt.hash(newPassword, 10)

  await db.query(
    'UPDATE user SET password = ? WHERE id = ?',
    [hashed, userId]
  )

  return { success: true }
})
