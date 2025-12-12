const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ملف لتخزين البيانات مؤقتًا
const dataFile = path.join(__dirname, "data/sensorData.json");

// POST endpoint من ESP32
app.post("/api/sensor", (req, res) => {
  const { spo2, heartrate } = req.body;
  if (typeof spo2 !== "number" || typeof heartrate !== "number") {
    return res.status(400).json({ message: "Invalid data" });
  }

  let sensorData = [];
  if (fs.existsSync(dataFile)) {
    sensorData = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  }

  const newEntry = { spo2, heartrate, ts: Date.now() };
  sensorData.push(newEntry);

  // احتفظ فقط بآخر 100 عنصر
  sensorData = sensorData.slice(-100);

  fs.writeFileSync(dataFile, JSON.stringify(sensorData, null, 2));

  res.json({ message: "Data saved", entry: newEntry });
});

// GET endpoint للواجهة
app.get("/api/get", (req, res) => {
  if (!fs.existsSync(dataFile)) return res.json([]);
  const sensorData = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  res.json(sensorData);
});

// ابدأ السيرفر
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
