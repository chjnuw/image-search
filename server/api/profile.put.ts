import { db } from '../db'
import { writeFile } from 'fs/promises'


export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not logged in'
    })
  }

  const formData = await readFormData(event)
  const username = formData.get('username')
  const image = formData.get('image') // File | null

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username is required'
    })
  }

  // 👉 update username ก่อน
  await db.query(
    'UPDATE user SET username = ? WHERE id = ?',
    [username, userId]
  )

  // 👉 ถ้ามีรูป ค่อยอัป
  if (image && image instanceof File) {
    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = `user-${userId}-${Date.now()}.png`
    const path = `public/uploads/${filename}`

    await writeFile(path, buffer)

    await db.query(
      'UPDATE user SET image = ? WHERE id = ?',
      [`/uploads/${filename}`, userId]
    )
  }

  return { success: true }
})
