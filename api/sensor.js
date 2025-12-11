import { neon } from "@neondatabase/serverless";

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const { rows } = await client.query("SELECT * FROM sensor ORDER BY time ASC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Neon error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
