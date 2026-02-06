import { db } from "~/server/db";
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401 })

const [rows] = await db.query<any[]>(
  "SELECT gender FROM user WHERE id = ?",
  [user]
);

const gender = rows?.[0]?.gender || 3;
})