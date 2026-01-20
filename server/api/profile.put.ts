import { db } from '../db'
import { writeFile } from 'fs/promises'
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')
  if (!userId) {
    throw createError({ statusCode: 401 })
  }

  const formData = await readFormData(event)
  const username = formData.get('username')
  const image = formData.get('image')
  const tagsRaw = formData.get('tags')

  const tags: number[] = tagsRaw
    ? JSON.parse(tagsRaw.toString())
    : []

  // update username
  await db.query(
    'UPDATE user SET username = ? WHERE id = ?',
    [username, userId]
  )

  // update image
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

  // 🔥 update tags
  await db.query(
    'DELETE FROM user_tags WHERE user_id = ?',
    [userId]
  )

  if (tags.length > 0) {
    const values = tags.map((tagId: number) => [userId, tagId])
    await db.query(
      'INSERT INTO user_tags (user_id, tag_id) VALUES ?',
      [values]
    )
  }

  return { success: true }
})
