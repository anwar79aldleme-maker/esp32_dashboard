import { neon } from "@neondatabase/serverless";

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { spo2, heartrate } = req.body;

  if (spo2 == null || heartrate == null) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    await client.sql`
      INSERT INTO sensor_data (spo2, heartrate, time)
      VALUES (${spo2}, ${heartrate}, NOW())
    `;
    res.status(200).json({ message: "Data saved" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
