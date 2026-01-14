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

  // 1. เช็ค user
// เช็ค user + otp เดิม
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

// 👉 ถ้ายังไม่หมดอายุ → ไม่ให้ส่งซ้ำ
if (rows[0].reset_expires && Date.now() < rows[0].reset_expires) {
  throw createError({
    statusCode: 429,
    statusMessage: 'OTP already sent. Please wait.'
  })
}

  // 2. สร้าง OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString()
const expires = Date.now() + 5 * 60 * 1000 // 5 นาที

await db.query(
  'UPDATE user SET reset_otp = ?, reset_expires = ? WHERE email = ?',
  [otp, expires, email]
)


  // 3. SAVE OTP ลง DB 👈 สำคัญ
  await db.query(
    'UPDATE user SET reset_otp = ?, reset_expires = ? WHERE email = ?',
    [otp, expires, email]
  )

  // 4. ส่งอีเมล
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
    from: `"ProjectM" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Reset Password Code',
    text: `Your OTP is ${otp}`
  })

  return { success: true }
})
