// server/utils/db.ts
import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),

  ssl: {
  rejectUnauthorized: true
},

  waitForConnections: true,
  connectionLimit: 10,
})
console.log('DB HOST:', process.env.DB_HOST)
console.log('DB PORT:', process.env.DB_PORT)


