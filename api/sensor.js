import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // إذا كان POST ادخل البيانات
    if (req.method === "POST") {
      const { heartrate, spo2 } = req.body;

      if (!heartrate || !spo2) {
        return res.status(400).json({ message: "Missing data" });
      }

      await sql`
        INSERT INTO sensor_data (heartrate, spo2)
        VALUES (${heartrate}, ${spo2})
      `;

      return res.status(200).json({ message: "Data inserted successfully" });
    }

    // إذا كان GET ارجع البيانات
   
