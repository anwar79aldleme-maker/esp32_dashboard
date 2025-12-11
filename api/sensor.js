import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { heartrate, spo2 } = req.body;

      if (!heartrate || !spo2)
        return res.status(400).json({ error: "Missing sensor values" });

      const sql = neon(process.env.DATABASE_URL);

      await sql(
        `INSERT INTO sensor_data (heartrate, spo2) VALUES ($1, $2)`,
        [heartrate, spo2]
      );

      return res.status(200).json({ message: "Data Saved" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "GET") {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const rows = await sql(`SELECT * FROM sensor_data ORDER BY time DESC LIMIT 100`);
      return res.status(200).json(rows);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
