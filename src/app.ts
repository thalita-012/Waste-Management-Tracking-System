import express from "express";
import paymentRoutes from "./routes/paymentRoute.js";
import truckRoutes from "./routes/TruckRouter.js";
import { testConnection } from "./config/db.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.get("/db-test", async (_req, res) => {
  const connected = await testConnection();
  if (!connected) {
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }
  return res.json({ success: true, message: "Database connected successfully" });
});

app.use("/api/payments", paymentRoutes);
app.use("/api", truckRoutes);

export default app;
