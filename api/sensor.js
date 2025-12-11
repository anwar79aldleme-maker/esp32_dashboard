import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    if (req.method === 'POST') {
      const { heartrate, spo2 } = req.body || {};
      if (heartrate == null || spo2 == null) {
        await client.end();
        return res.status(400).json({ message: 'Missing sensor data' });
      }

      await client.query(
        'INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())',
        [heartrate, spo2]
      );
      await client.end();
      return res.status(200).json({ message: 'Data saved successfully' });

    } else if (req.method === 'GET') {
      const result = await client.query(
        'SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC LIMIT 50'
      );
      await client.end();
      return res.status(200).json(result.rows);

    } else {
      await client.end();
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    await client.end();
    console.error(error);
    return res.status(500).json({ message: 'Server error', detail: error.message });
  }
}
