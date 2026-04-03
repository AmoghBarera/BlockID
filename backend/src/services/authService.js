import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { nanoid } from "nanoid";
import { env } from "../config/env.js";
import { db } from "../models/store.js";
import { recordAudit } from "./auditService.js";

export function getNonce(walletAddress) {
  const normalized = walletAddress.toLowerCase();
  const nonce = nanoid(12);
  db.nonces.set(normalized, nonce);
  return nonce;
}

export function verifyWalletSignature(walletAddress, signature) {
  const normalized = walletAddress.toLowerCase();
  const nonce = db.nonces.get(normalized);
  if (!nonce) throw new Error("Nonce not found");

  const message = `BlockID authentication nonce: ${nonce}`;
  const signer = ethers.verifyMessage(message, signature).toLowerCase();
  if (signer !== normalized) throw new Error("Signature mismatch");

  const existingUser = db.users.get(normalized);
  const role = existingUser?.role || (normalized === env.adminWallet ? "admin" : "user");
  const profile = { walletAddress: normalized, role };
  db.users.set(normalized, profile);
  recordAudit("AUTH_LOGIN", normalized, { role });

  return jwt.sign(profile, env.jwtSecret, { expiresIn: "8h" });
}

export function upsertRole(walletAddress, role) {
  const normalized = walletAddress.toLowerCase();
  const existing = db.users.get(normalized) || { walletAddress: normalized };
  const updated = { ...existing, role };
  db.users.set(normalized, updated);
  recordAudit("ROLE_UPDATED", normalized, { role });
  return updated;
}
