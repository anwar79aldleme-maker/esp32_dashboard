import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // منع أي cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'POST') {
      const { heartrate, spo2 } = req.body || {};
      if (heartrate == null || spo2 == null) {
        return res.status(400).json({ message: 'Missing sensor data' });
      }
      await client.query(
        'INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())',
        [heartrate, spo2]
      );
      return res.status(200).json({ message: 'Data saved successfully' });

    } else if (req.method === 'GET') {
      const result = await client.query(
        'SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC LIMIT 50'
      );
      return res.status(200).json(result.rows ? result.rows : result);

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', detail: error.message });
  }
}
