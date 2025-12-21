import { db } from '~/server/db'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, gender } = body

  if (!name || !email || !password || !gender) {
    return { ok: false, message: 'ข้อมูลไม่ครบ' }
  }

  // เช็กซ้ำ
  const [rows]: any = await db.query(
    'SELECT id FROM user WHERE username = ? OR email = ?',
    [name, email]
  )

  if (rows.length > 0) {
    return { ok: false, message: 'Username หรือ Email นี้ถูกใช้แล้ว' }
  }

  // 🔐 เข้ารหัส password
  const hashedPassword = await bcrypt.hash(password, 10)

  const [result]: any = await db.query(
    `INSERT INTO user (username, email, password, gender, role, status)
     VALUES (?, ?, ?, ?, 'user', 1)`,
    [name, email, hashedPassword, gender]
  )

  return {
    ok: true,
    userId: result.insertId
  }
})
