// server/utils/db.ts
import mysql from 'mysql2/promise'

if (!process.env.MYSQL_PUBLIC_URL) {
  throw new Error('❌ MYSQL_PUBLIC_URL is missing')
}

  export const db = mysql.createPool({
    uri: process.env.MYSQL_PUBLIC_URL,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
})