import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Home() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/get", { cache: "no-store" });
      const json = await res.json();

      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>ESP32 Health Dashboard</h1>
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="created_at"
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="heartrate" stroke="#8884d8" />
          <Line type="monotone" dataKey="spo2" stroke="#82ca9d" />
        </LineChart>
      )}
      {data.length > 0 && (
        <div>
          Latest: {data[data.length - 1].heartrate}, SPO2:{" "}
          {data[data.length - 1].spo2}
        </div>
      )}
    </div>
  );
}

