import { neon } from "@neondatabase/serverless";

const client = new neon.Client({
  // إعدادات Neon
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { heartrate, spo2 } = req.body;
    await client.connect();
    await client.query(
      "INSERT INTO sensor_data (heartrate, spo2) VALUES ($1, $2)",
      [heartrate, spo2]
    );
    await client.end();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
