const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let sensorData = []; // لتخزين البيانات مؤقتًا

// استقبال البيانات من ESP32
app.post("/api/sensor", (req, res) => {
  const { heartrate, spo2 } = req.body;
  if (typeof heartrate !== "number" || typeof spo2 !== "number") {
    return res.status(400).json({ message: "Invalid data" });
  }
  const entry = { time: Date.now(), heartrate, spo2 };
  sensorData.push(entry);
  if (sensorData.length > 100) sensorData.shift(); // آخر 100 قيمة
  res.json({ message: "Data saved", entry });
});

// إرسال البيانات للواجهة
app.get("/api/sensor", (req, res) => {
  res.json(sensorData);
});

module.exports = app;

