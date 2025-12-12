import { Client } from "@neondatabase/serverless";

// إنشاء client مرة واحدة على مستوى الملف
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await client.query(
        "SELECT * FROM sensor_data ORDER BY time ASC"
      );
      res.status(200).json(result.rows);
    } else if (req.method === "POST") {
      const { heartrate, spo2 } = req.body;
      if (heartrate == null || spo2 == null) {
        return res.status(400).json({ message: "Missing data" });
      }
      await client.query(
        "INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())",
        [heartrate, spo2]
      );
      res.status(200).json({ message: "Data saved successfully" });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
