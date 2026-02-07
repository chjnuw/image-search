import { db } from '~/server/db'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, gender, birthdate, age } = body

  // 1️⃣ validate
  if (!name || !email || !password || !gender) {
    return { ok: false, message: 'ข้อมูลไม่ครบ' }
  }

  // 2️⃣ เช็ก email ซ้ำ (แก้ถูกแล้ว)
  const [rows]: any = await db.query(
    'SELECT id FROM user WHERE email = ?',
    [email]
  )

  if (rows.length > 0) {
    return { ok: false, message: 'Email นี้ถูกใช้แล้ว' }
  }

  // 3️⃣ hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 4️⃣ สร้าง OTP ยืนยันอีเมล
  const emailOtp = Math.floor(100000 + Math.random() * 900000).toString()
  const emailExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 นาที

  // 5️⃣ insert user (ยังไม่ verify → status = 0)
  const [result]: any = await db.query(
    `INSERT INTO user_register_temp 
(username, email, password, gender, birthdate, age, email_otp, email_expires)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`,[
  name,
  email,
  hashedPassword,
  gender,
  birthdate || null,
  age || null,
  emailOtp,
  emailExpires
]

  )

  // 6️⃣ ส่งอีเมล OTP
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
    subject: 'ยืนยันอีเมลของคุณ',
    html: `
      <h3>รหัสยืนยันอีเมล</h3>
      <h2>${emailOtp}</h2>
      <p>รหัสนี้มีอายุ 5 นาที</p>
    `
  })

  // 7️⃣ response กลับ frontend
  return {
    ok: true,
    needVerify: true,
    userId: result.insertId,
    message: 'กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน'
  }
})
