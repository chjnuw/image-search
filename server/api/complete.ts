import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  const { userId, tags } = await readBody(event)

  if (!userId || !Array.isArray(tags) || tags.length !== 3) {
    return { ok: false }
  }

  const [temp]: any = await db.query(
    'SELECT * FROM user_register_temp WHERE id = ?',
    [userId]
  )

  if (temp.length === 0) {
    return { ok: false }
  }

  const u = temp[0]

  const [res]: any = await db.query(
    `INSERT INTO user
     (username, email, password, gender, birthdate, age, role)
     VALUES (?, ?, ?, ?, ?, ?, 'user')`,
    [
      u.username,
      u.email,
      u.password,
      u.gender,
      u.birthdate,
      u.age
    ]
  )

  const newUserId = res.insertId

  for (const tagId of tags) {
    await db.query(
      'INSERT INTO user_tags (user_id, tag_id) VALUES (?, ?)',
      [newUserId, tagId]
    )
  }

  await db.query(
    'DELETE FROM user_register_temp WHERE id = ?',
    [userId]
  )

  return { ok: true }
})
