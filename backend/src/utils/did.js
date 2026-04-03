import { sha256 } from "./crypto.js";

export function generateDid({ walletAddress, email, collegeId }) {
  const seed = `${walletAddress.toLowerCase()}|${email.trim().toLowerCase()}|${collegeId.trim().toUpperCase()}`;
  return `did:blockid:${sha256(seed).slice(0, 32)}`;
}

export function buildProofHash(identityInput, documentHashes) {
  const canonical = JSON.stringify(identityInput);
  return sha256([sha256(canonical), ...documentHashes].join("|"));
}
