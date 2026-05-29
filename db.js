const mysql = require('mysql2/promise');
require('dotenv').config();
const useSSL = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'inkwell',
  port:     Number(process.env.DB_PORT) || 3306,
  ssl:      useSSL ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
});
