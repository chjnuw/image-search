import { defineEventHandler, getCookie } from "h3";
import { db } from "~/server/db";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user_id");
  if (!userId) return [];

  const [rows]: any = await db.query(
    `
    SELECT t.id, t.name
    FROM user_tags ut
    JOIN tag t ON t.id = ut.tag_id
    WHERE ut.user_id = ?
    `,
    [userId]
  );

  return rows;
});