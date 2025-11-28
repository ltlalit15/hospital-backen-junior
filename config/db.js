import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Pool creation with DB_PORT support
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // Default MySQL port
  user: process.env.DB_USER,
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection immediately (optional)
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected (POOL)");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  }
})();

export default pool;
