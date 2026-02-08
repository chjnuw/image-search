// server/utils/db.ts
import mysql from "mysql2/promise";
import fs from 'fs'

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),

  ssl: {
    ca: fs.readFileSync('./ca.pem'),
  },

  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,

  connectTimeout: 20000,
});
console.log("DB HOST:", process.env.DB_HOST);
console.log("DB PORT:", process.env.DB_PORT);
