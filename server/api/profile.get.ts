import { getCookie } from 'h3'
import { db } from '../db'

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  console.log('PROFILE COOKIE user_id =', userId)
  console.log('COOKIE HEADER =', event.node.req.headers.cookie)


  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not logged in'
    })
  }

  const [rows]: any = await db.query(
    'SELECT id, username, email, image FROM user WHERE id = ? LIMIT 1',
    [userId]
  )

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  return rows[0]
})
