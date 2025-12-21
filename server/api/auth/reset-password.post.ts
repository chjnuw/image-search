import bcrypt from 'bcrypt'
import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!password) {
    throw createError({ statusCode: 400, statusMessage: 'Password required' })
  }

  const hash = await bcrypt.hash(password, 10)

  await db.query(
    `UPDATE user 
     SET password = ?, reset_otp = NULL, reset_expires = NULL
     WHERE email = ?`,
    [hash, email]
  )

  return { success: true }
})
