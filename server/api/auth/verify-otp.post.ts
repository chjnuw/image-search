import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const { email, otp } = await readBody(event)

  const [rows]: any = await db.query(
    'SELECT id, reset_expires FROM user WHERE email = ? AND reset_otp = ?',
    [email, otp]
  )

  if (!rows.length) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid code' })
  }

  if (Date.now() > rows[0].reset_expires) {
    throw createError({ statusCode: 400, statusMessage: 'Code expired' })
  }

  return { success: true }
})
