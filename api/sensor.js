import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  console.log('Handler started');
  console.log('Request method:', req.method);

  try {
    if (req.method === 'POST') {
      console.log('POST body:', req.body);
      const { heartrate, spo2 } = req.body || {};

      if (heartrate == null || spo2 == null) {
        console.error('Missing data in POST:', req.body);
        return res.status(400).json({ message: 'Missing sensor data' });
      }

      if (typeof heartrate !== 'number' || typeof spo2 !== 'number') {
        console.error('Invalid data types in POST:', req.body);
        return res.status(400).json({ message: 'Invalid data types' });
      }

      try {
        console.log('Inserting data into Neon...');
        await client.query(
          'INSERT INTO sensor_data (heartrate, spo2, time) VALUES ($1, $2, NOW())',
          [heartrate, spo2]
        );
        console.log('Data saved successfully:', { heartrate, spo2 });
        return res.status(200).json({ message: 'Data saved successfully' });
      } catch (err) {
        console.error('Database insert error:', err.message);
        return res.status(500).json({ message: 'Database insert failed', detail: err.message });
      }

    } else if (req.method === 'GET') {
      try {
        console.log('Fetching data from Neon...');
        const result = await client.query(
          'SELECT heartrate, spo2, time FROM sensor_data ORDER BY time ASC '
        );

        const rows = result.rows ? result.rows : result;

        const data = rows.map(r => ({
          heartrate: r.heartrate,
          spo2: r.spo2,
          time: r.time ? r.time : new Date().toISOString()
        }));

        console.log('Fetched rows:', data.length);
        return res.status(200).json(data);
      } catch (err) {
        console.error('Database fetch error:', err.message);
        return res.status(500).json({ message: 'Database fetch failed', detail: err.message });
      }

    } else {
      console.warn('Method not allowed:', req.method);
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Unexpected server error:', error.message);
    console.error(error.stack);
    return res.status(500).json({ message: 'Server error', detail: error.message });
  }
}

