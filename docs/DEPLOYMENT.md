# Deployment Guide

## Local Development

### 1. Smart Contract

```bash
cd contracts
npm install
cp .env.example .env
npx hardhat node
```

In a new terminal:

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Testnet Deployment

1. Fund deployer wallet with Polygon Amoy or Sepolia test tokens.
2. Set `PRIVATE_KEY`, `RPC_URL`, and `POLYGONSCAN_API_KEY` in `contracts/.env`.
3. Run `npx hardhat run scripts/deploy.ts --network amoy`.
4. Update `backend/.env` and `frontend/.env` with deployed contract address.
5. Configure Pinata keys in backend for live IPFS uploads.

## Production Notes

- Move JWT secret and private keys to a vault
- Use HTTPS, WAF, and rate limiting
- Add real OCR/document verification and ZK credentials
- Use managed IPFS pinning and encrypted object storage backups
