import { Client } from '@neondatabase/serverless';


export default async function handler(req, res) {
if(req.method !== 'GET'){
return res.status(405).json({ message: 'Method not allowed' });
}


const client = new Client({
connectionString: process.env.NEON_DATABASE_URL
});


try {
await client.connect();
const result = await client.query('SELECT * FROM sensor_data ORDER BY time ASC');
await client.end();
res.status(200).json(result.rows);
} catch (err) {
console.error('Database error:', err);
res.status(500).json({ message: 'Server error', error: err.message });
}
}
