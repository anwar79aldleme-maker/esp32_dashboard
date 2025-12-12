import { neon } from "@neondatabase/serverless";

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const result = await client.sql`SELECT * FROM sensor_data ORDER BY time ASC`;
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
