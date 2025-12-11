import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { heartrate, spo2 } = req.body;

      if (heartrate == null || spo2 == null) {
        console.error('POST missing data:', req.body);
        return res.status(400).json({ message: 'Missing sensor data' });
      }

      if (typeof heartrate !== 'number' || typeof spo2 !== 'number') {
        console.error('POST invalid types:', req.body);
        return res.status(400).json({ message: 'Invalid data types' });
      }

      // إدخال البيانات مع وقت تلقائي
      await client.query(
        'INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())',
        [heartrate, spo2]
      );

      console.log('Data saved:', { heartrate, spo2 });
      return res.status(200).json({ message: 'Data saved successfully' });

    } else if (req.method === 'GET') {
      const result = await client.query(
        'SELECT time, heartrate, spo2 FROM sensor_data ORDER BY time ASC LIMIT 50;'
      );
      return res.status(200).json(result.rows);

    } else {
      console.warn('Method not allowed:', req.method);
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Server error:', error.message);
    console.error(error.stack);
    return res.status(500).json({ message: 'Server error', detail: error.message });
  }
}
