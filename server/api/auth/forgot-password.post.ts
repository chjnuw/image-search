import nodemailer from 'nodemailer'
import { db } from '../../db'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email required'
    })
  }

  // เช็ค user
  const [rows]: any = await db.query(
    'SELECT id FROM user WHERE email = ? LIMIT 1',
    [email]
  )

  if (rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Email not found'
    })
  }

  // สร้าง OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // TODO: save otp (db หรือ memory)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"ProjectM" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Reset Password Code',
    text: `Your OTP is ${otp}`
  })

  return { success: true }
})
