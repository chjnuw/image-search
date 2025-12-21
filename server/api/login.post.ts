import { db } from '../db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const [rows]: any = await db.query(
    'SELECT id, password FROM user WHERE email = ? LIMIT 1',
    [email]
  )

  if (!rows.length) {
    throw createError({ statusCode: 400, statusMessage: 'User not found' })
  }

  const user = rows[0]
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw createError({ statusCode: 400, statusMessage: 'Wrong password' })
  }

  // ✅ สร้าง JWT
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  // ✅ เก็บ token
setCookie(event, 'user_id', String(user.id), {
  httpOnly: true,
  path: '/',
  sameSite: 'lax'
})


  return { ok: true }
})
