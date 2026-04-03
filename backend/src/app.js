import cors from "cors";
import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import identityRoutes from "./routes/identityRoutes.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "blockid-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api", identityRoutes);
