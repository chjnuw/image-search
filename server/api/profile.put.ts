import { db } from '../db'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import {
  getCookie,
  readFormData,
  createError,
  defineEventHandler
} from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // 🔐 check login
    const userId = getCookie(event, 'user_id')
    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not logged in'
      })
    }

    // 📦 read multipart form data
    const formData = await readFormData(event)

    const username = formData.get('username')
    const image = formData.get('image')
    const tagsRaw = formData.get('tags')

    if (!username || typeof username !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username is required'
      })
    }

    // 🏷 parse tags
    const tags: number[] = tagsRaw
      ? JSON.parse(tagsRaw.toString())
      : []

    /* ---------- update username ---------- */
    await db.query(
      'UPDATE user SET username = ? WHERE id = ?',
      [username, userId]
    )

    /* ---------- update image ---------- */
    // image type = string | Blob
    if (image instanceof Blob) {
      const buffer = Buffer.from(await image.arrayBuffer())

      const uploadDir = 'public/uploads'
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const filename = `user-${userId}-${Date.now()}.png`
      const filePath = `${uploadDir}/${filename}`

      await writeFile(filePath, buffer)

      await db.query(
        'UPDATE user SET image = ? WHERE id = ?',
        [`/uploads/${filename}`, userId]
      )
    }

    /* ---------- update tags ---------- */
    await db.query(
      'DELETE FROM user_tags WHERE user_id = ?',
      [userId]
    )

    if (tags.length > 0) {
      const values = tags.map((tagId) => [userId, tagId])

      await db.query(
        'INSERT INTO user_tags (user_id, tag_id) VALUES ?',
        [values]
      )
    }

    return {
      success: true
    }
  } catch (err) {
    // 🔥 log error จริง ๆ ลง terminal
    console.error('PROFILE PUT ERROR:', err)
    throw err
  }
})
