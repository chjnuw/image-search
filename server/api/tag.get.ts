import { db } from '../db'

export default defineEventHandler(async () => {
  const [rows]: any = await db.query(
    'SELECT id, name FROM tag ORDER BY name'
  )

  return rows
})
