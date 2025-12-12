import { Client } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { heartrate, spo2 } = req.body;

  if (typeof heartrate !== "number" || typeof spo2 !== "number") {
    return res.status(400).json({ message: "Invalid data" });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    await client.query(
      "INSERT INTO sensor_data (heartrate, spo2) VALUES ($1, $2)",
      [heartrate, spo2]
    );
    await client.end();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    await client.end();
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

