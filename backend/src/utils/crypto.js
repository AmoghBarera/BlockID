import crypto from "crypto";

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function encryptJson(payload) {
  const serialized = JSON.stringify(payload);
  return Buffer.from(serialized, "utf8").toString("base64");
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
