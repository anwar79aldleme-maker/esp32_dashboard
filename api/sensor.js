import { Pool } from "@neondatabase/serverless";

let pool;
if (!global._pool) {
  pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  global._pool = pool;
} else {
  pool = global._pool;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const { heartrate, spo2 } = req.body;
    if (typeof heartrate !== "number" || typeof spo2 !== "number") {
      return res.status(400).json({ message: "Invalid data" });
    }
    await pool.query(
      "INSERT INTO sensor_data (time, heartrate, spo2) VALUES ($1, $2, $3)",
      [Date.now(), heartrate, spo2]
    );
    res.status(200).json({ message: "Data saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
