import { getNonce, upsertRole, verifyWalletSignature } from "../services/authService.js";

export function requestNonce(req, res) {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ message: "walletAddress is required" });
  res.json({ nonce: getNonce(walletAddress), message: "Sign this nonce using MetaMask" });
}

export function verifySignature(req, res) {
  try {
    const { walletAddress, signature } = req.body;
    const token = verifyWalletSignature(walletAddress, signature);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

export function updateRole(req, res) {
  const { walletAddress, role } = req.body;
  res.json({ user: upsertRole(walletAddress, role) });
}
