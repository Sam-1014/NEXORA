
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let transactions = Array.from({ length: 12 }, (_, i) => ({
  id: `TXN-${1001 + i}`,
  amount: [1250, 2499, 799, 3200, 1500, 450, 2800, 999, 1750, 650, 2100, 850][i],
  currency: "INR",
  status: i === 3 || i === 8 ? "FAILED" : "SUCCESS",
  provider: "DEMO",
  createdAt: new Date(Date.now() - i * 60000).toISOString()
}));

let incidents = [];

function getMetrics() {
  const total = transactions.length;
  const successful = transactions.filter(
    (t) => t.status === "SUCCESS"
  ).length;
  const failed = transactions.filter(
    (t) => t.status === "FAILED"
  ).length;
  const volume = transactions
    .filter((t) => t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalTransactions: total,
    successfulTransactions: successful,
    failedTransactions: failed,
    successRate: total ? Number((successful / total * 100).toFixed(1)) : 0,
    successfulVolume: volume,
    currency: "INR",
    activeIncidents: incidents.filter(
      (incident) => incident.status === "OPEN"
    ).length
  };
}

app.get("/", (req, res) => {
  res.json({
    name: "NEXORA",
    message: "Payment Reliability API",
    status: "online"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    service: "NEXORA",
    status: "healthy",
    uptime: process.uptime()
  });
});

app.get("/api/metrics", (req, res) => {
  res.json(getMetrics());
});

app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});

app.post("/api/simulate-incident", (req, res) => {
  const failedTransactions = transactions.filter(
    (t) => t.status === "FAILED"
  ).length;

  for (let i = 0; i < 5; i++) {
    transactions.unshift({
      id: `TXN-${Date.now()}-${i}`,
      amount: 500 + i * 250,
      currency: "INR",
      status: "FAILED",
      provider: "DEMO",
      createdAt: new Date().toISOString()
    });
  }

  const incident = {
    id: `INC-${Date.now()}`,
    title: "Payment failure spike detected",
    severity: "HIGH",
    description: "Five simulated payment failures were injected.",
    previousFailures: failedTransactions,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    source: "SIMULATION"
  };

  incidents.unshift(incident);

  res.json({
    message: "Demo incident created.",
    incident,
    metrics: getMetrics()
  });
});

app.post("/api/incidents/:id/recover", (req, res) => {
  const incident = incidents.find(
    (item) => item.id === req.params.id
  );

  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }

  if (incident.status !== "OPEN") {
    return res.status(400).json({
      error: "This incident is not open."
    });
  }

  incident.status = "RESOLVED";
  incident.resolution = "Demo recovery acknowledged.";
  incident.resolvedAt = new Date().toISOString();

  res.json({
    message: "Demo incident marked as resolved.",
    incident,
    metrics: getMetrics()
  });
});

app.listen(PORT, () => {
  console.log(`NEXORA backend running at http://localhost:${PORT}`);
});