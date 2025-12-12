import { Client } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { spo2, heartrate } = req.body;

  if (typeof spo2 !== "number" || typeof heartrate !== "number") {
    return res.status(400).json({ message: "Invalid data format" });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    await client.query(
      `INSERT INTO sensor_data (spo2, heartrate) VALUES ($1, $2)`,
      [spo2, heartrate]
    );

    await client.end();
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
