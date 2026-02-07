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
    'SELECT id, reset_expires FROM user WHERE email = ? LIMIT 1',
    [email]
  )

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Email not found'
    })
  }

  // ถ้า OTP ยังไม่หมดอายุ → ห้ามส่งซ้ำ
  if (rows[0].reset_expires && Date.now() < rows[0].reset_expires) {
    throw createError({
      statusCode: 429,
      statusMessage: 'OTP already sent. Please wait.'
    })
  }

  // สร้าง OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = Date.now() + 5 * 60 * 1000 // 5 นาที

  // บันทึก OTP
  await db.query(
    'UPDATE user SET reset_otp = ?, reset_expires = ? WHERE email = ?',
    [otp, expires, email]
  )

  // ส่งเมล
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"MovieGuide" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Reset Password Code',
    html: `
      <h2>Reset Password</h2>
      <p>รหัส OTP ของคุณคือ</p>
      <h1>${otp}</h1>
      <p>รหัสนี้มีอายุ 5 นาที</p>
    `
  })

  return { success: true }
})
