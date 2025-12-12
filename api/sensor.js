import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Handle POST → insert new data
    if (req.method === "POST") {
      const { heartrate, spo2 } = req.body;

      if (heartrate === undefined || spo2 === undefined) {
        return res.status(400).json({ message: "Missing heartrate or spo2" });
      }

      await sql`
        INSERT INTO sensor_data (heartrate, spo2)
        VALUES (${heartrate}, ${spo2})
      `;

      return res.status(200).json({ message: "Data saved successfully" });
    }

    // Handle GET → return latest 50 rows
    if (req.method === "GET") {
      const rows = await sql`
        SELECT heartrate, spo2, time
        FROM sensor_data
        ORDER BY time DESC
        LIMIT 50
      `;

      return res.status(200).json(rows);
    }

    // Invalid method
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}
