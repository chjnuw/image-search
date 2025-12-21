import { db } from '../../db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, tags } = body

    console.log('🔥 SAVE TAG BODY =', body)

    if (!userId || !Array.isArray(tags)) {
      return { ok: false, message: 'ข้อมูลไม่ครบ' }
    }

    for (const tagId of tags) {
      await db.query(
        'INSERT IGNORE INTO user_tags (user_id, tag_id) VALUES (?, ?)',
        [userId, tagId]
      )
    }

    return { ok: true }

  } catch (err: any) {
    console.error('🔥 USER TAG ERROR =', err)
    return {
      ok: false,
      message: err.message
    }
  }
})
