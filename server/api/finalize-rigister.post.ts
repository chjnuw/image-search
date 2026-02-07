import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, tags } = body

  if (!userId || !Array.isArray(tags) || tags.length !== 3) {
    return { ok: false, message: 'ข้อมูลไม่ครบ' }
  }

  // 1️⃣ ดึง user จาก temp (ต้อง verify แล้ว)
  const [temp]: any = await db.query(
    `SELECT * FROM user_register_temp 
     WHERE id = ? AND email_verified = 1`,
    [userId]
  )

  if (temp.length === 0) {
    return { ok: false, message: 'ยังไม่ยืนยันอีเมล' }
  }

  const u = temp[0]

  // 2️⃣ insert user จริง
  const [userResult]: any = await db.query(
    `INSERT INTO user 
     (username, email, password, gender, role, status, birthdate, age)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    [
      u.username,
      u.email,
      u.password,
      u.gender,
      u.role,
      u.birthdate,
      u.age
    ]
  )

  const newUserId = userResult.insertId

  // 3️⃣ insert tags
  for (const tagId of tags) {
    await db.query(
      `INSERT INTO user_tags (user_id, tag_id)
       VALUES (?, ?)`,
      [newUserId, tagId]
    )
  }

  // 4️⃣ ลบ temp
  await db.query(
    `DELETE FROM user_register_temp WHERE id = ?`,
    [userId]
  )

  return {
    ok: true,
    message: 'สมัครสมาชิกสำเร็จ'
  }
})
