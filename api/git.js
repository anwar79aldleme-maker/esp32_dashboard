import { Pool } from "@neondatabase/serverless";

let pool;
if (!global._pool) {
  pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  global._pool = pool;
} else {
  pool = global._pool;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM sensor_data ORDER BY time DESC LIMIT 50"
    );
    res.status(200).json(result.rows.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
