// api/sensor.js
let sensorData = []; // لتخزين آخر البيانات

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { heartrate, spo2 } = req.body;

      if (typeof heartrate !== "number" || typeof spo2 !== "number") {
        return res.status(400).json({ message: "Invalid data" });
      }

      const timestamp = Date.now();
      const newEntry = { heartrate, spo2, time: timestamp };
      sensorData.push(newEntry);

      // نحافظ على آخر 100 قيمة فقط
      if (sensorData.length > 100) {
        sensorData = sensorData.slice(-100);
      }

      return res.status(200).json({ message: "Data received", data: newEntry });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  } else if (req.method === "GET") {
    // إرجاع آخر 50 قيمة للعرض في Dashboard
    return res.status(200).json(sensorData.slice(-50));
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
