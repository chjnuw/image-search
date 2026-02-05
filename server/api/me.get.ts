import { getCookie } from "h3";
import { db } from "../db";

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, "user_id");
  
  if (!userId) {
    throw createError({ statusCode: 401 });
  }

  const [rows]: any = await db.query(
    "SELECT id, username, email, image FROM user WHERE id = ? LIMIT 1",
    [userId]
  );

  if (!rows.length) {
    throw createError({ statusCode: 404 });
  }

  return rows[0];
});
