import { Client } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM sensor_data ORDER BY id DESC LIMIT 50"
    );
    await client.end();
    res.status(200).json(result.rows.reverse());
  } catch (err) {
    await client.end();
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

