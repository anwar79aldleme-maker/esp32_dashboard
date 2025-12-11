import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // استقبال البيانات من ESP32
    const { heartrate, spo2 } = req.body;

    if (heartrate == null || spo2 == null) {
      return res.status(400).json({ message: 'Missing sensor data' });
    }

    try {
      await client.query(
        'INSERT INTO sensor_data (heartrate, spo2) VALUES ($1, $2)',
        [heartrate, spo2]
      );
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data' });
    }

  } else if (req.method === 'GET') {
    // جلب البيانات للـ Dashboard
    try {
      const result = await client.query(
        'SELECT time, heartrate, spo2 FROM sensor_data ORDER B_
