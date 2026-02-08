import { db } from '~/server/db'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, gender, birthdate, age } = body

  // 1️⃣ validate
  if (!name || !email || !password || !gender) {
    return { ok: false, message: 'ข้อมูลไม่ครบ' }
  }

  // 2️⃣ เช็ก username ซ้ำ
  const [nameRows]: any = await db.query(
    'SELECT id FROM user WHERE username = ?',
    [name]
  )

  if (nameRows.length > 0) {
    return {
      ok: false,
      field: 'name',
      message: 'ชื่อนี้ถูกใช้แล้ว กรุณาใช้ชื่ออื่น'
    }
  }

  // 3️⃣ เช็ก email ซ้ำ
  const [emailRows]: any = await db.query(
    'SELECT id FROM user WHERE email = ?',
    [email]
  )

  if (emailRows.length > 0) {
    return {
      ok: false,
      field: 'email',
      message: 'อีเมลนี้ถูกใช้แล้ว กรุณาใช้อีเมลอื่น'
    }
  }

  // 4️⃣ hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 5️⃣ สร้าง OTP ยืนยันอีเมล
  const emailOtp = Math.floor(100000 + Math.random() * 900000).toString()
  const emailExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 นาที

  // 6️⃣ insert user (ยังไม่ verify)
  const [result]: any = await db.query(
    `INSERT INTO user_register_temp 
      (username, email, password, gender, birthdate, age, email_otp, email_expires)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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

  // 7️⃣ ส่งอีเมล OTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  try {
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
  } catch (error) {
    console.error('Send email error:', error)
    return {
      ok: false,
      message: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่'
    }
  }

  // 8️⃣ response กลับ frontend
  return {
    ok: true,
    needVerify: true,
    userId: result.insertId,
    message: 'กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน'
  }
})