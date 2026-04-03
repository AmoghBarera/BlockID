import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient role" });
    }
    next();
  };
}
