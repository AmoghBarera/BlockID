import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  adminWallet: (process.env.ADMIN_WALLET || "").toLowerCase(),
  pinataJwt: process.env.PINATA_JWT || "",
  rpcUrl: process.env.RPC_URL || "http://127.0.0.1:8545",
  contractAddress: process.env.CONTRACT_ADDRESS || ""
};
