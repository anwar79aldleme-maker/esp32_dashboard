import pkg from "pg";
const { Client } = pkg;

const connectionString = process.env.DATABASE_URL;

export default async function handler(req, res) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    if (req.method === "POST") {
      const { heartrate, spo2 } = req.body || {};
      if (heartrate == null || spo2 == null) {
        return res.status(400).json({ message: "Missing sensor data" });
      }

      await client.query(
        "INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())",
        [heartrate, spo2]
      );
      return res.status(200).json({ message: "Data saved successfully" });
    }

    if (req.method === "GET") {
      const result = await client.query(
        "SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC LIMIT 50"
      );
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      return res.status(200).json(result.rows);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", detail: err.message });
  } finally {
    await client.end();
  }
}
