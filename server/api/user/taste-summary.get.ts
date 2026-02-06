import { defineEventHandler, getCookie } from 'h3'
import type { RowDataPacket } from 'mysql2'
import { db } from '~/server/db'

type TasteRow = RowDataPacket & {
  tag_id: number
  tag_name: string
  count: number
}

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')
  if (!userId) return []

  const [rows] = await db.query<TasteRow[]>(
    `
    SELECT
      t.id AS tag_id,
      t.name AS tag_name,
      COUNT(*) AS count
    FROM user_tags ut
    JOIN tag t ON t.id = ut.tag_id
    WHERE ut.user_id = ?
    GROUP BY t.id, t.name
    ORDER BY count DESC
    `,
    [userId]
  )

  return rows
})
