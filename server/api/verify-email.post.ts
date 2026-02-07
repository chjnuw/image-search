import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const { email, otp } = await readBody(event)

  if (!email || !otp) {
    return { ok: false, message: 'ข้อมูลไม่ครบ' }
  }

  // 🔥 ต้องเป็น user_register_temp เท่านั้น
  const [rows]: any = await db.query(
    `SELECT id, email_otp, email_expires
     FROM user_register_temp
     WHERE email = ?
       AND email_otp = ?
       AND email_expires > NOW()`,
    [email, otp]
  )

  if (rows.length === 0) {
    return { ok: false, message: 'รหัสไม่ถูกต้องหรือหมดอายุ' }
  }

  return {
    ok: true,
    message: 'ยืนยันอีเมลสำเร็จ',
    userId: rows[0].id
  }
})
