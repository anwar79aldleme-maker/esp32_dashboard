// api/sensor.js
import { sql } from "../lib/db.js";


export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Only POST allowed" });
}


try {
const { spo2, heartrate } = req.body;


if (!spo2 || !heartrate) {
return res.status(400).json({ error: "Missing sensor data" });
}


await sql(
`INSERT INTO sensor_data (spo2, heartrate) VALUES ($1, $2)`,
[spo2, heartrate]
);


return res.status(200).json({ success: true });
} catch (error) {
return res.status(500).json({ error: error.message });
}
}
