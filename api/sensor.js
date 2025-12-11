import { neon } from '@neondatabase/serverless';

const client = new neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await client.query(`
        SELECT time, heartrate, spo2 
        FROM sensor_data 
        ORDER BY time ASC 
        LIMIT 50;
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

