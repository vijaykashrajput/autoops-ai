import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function App() {
  const [health, setHealth] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch health
  const fetchHealth = async () => {
    const res = await axios.get(`${API}/health`);
    setHealth(res.data);
  };

  // Fetch logs
  const fetchLogs = async () => {
    const res = await axios.get(`${API}/logs`);
    setLogs(res.data.reverse());
  };

  // Trigger alert
  const triggerAlert = async () => {
    setLoading(true);
    await axios.post(`${API}/alert`, {
      metric: "cpu",
      value: 95
    });
    setLoading(false);
    fetchLogs();
  };

  useEffect(() => {
    fetchHealth();
    fetchLogs();

    const interval = setInterval(() => {
      fetchLogs();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AutoOps AI Dashboard</h1>

      {/* Health Section */}
      <h2>System Health</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {Object.entries(health).map(([key, value]) => (
          <div
            key={key}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              background: value === "UP" ? "#d4edda" : "#f8d7da"
            }}
          >
            <strong>{key}</strong>: {value}
          </div>
        ))}
      </div>

      {/* Trigger */}
      <h2>Trigger Alert</h2>
      <button onClick={triggerAlert} disabled={loading}>
        {loading ? "Running..." : "Simulate CPU Alert"}
      </button>

      {/* Logs */}
      <h2>Logs</h2>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px"
        }}
      >
        {logs.map((log, index) => (
          <div key={index}>
            <strong>{log.timestamp}</strong> - {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;