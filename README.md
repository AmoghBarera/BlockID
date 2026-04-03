# BlockID: Decentralized Identity Verification System

BlockID is a full-stack prototype for privacy-preserving decentralized identity verification using Solidity, Hardhat, Node.js, React, Tailwind CSS, MetaMask, and IPFS-ready storage flows.

## Problem Statement

Traditional identity verification depends on centralized databases that introduce data breach risk, identity theft exposure, privacy loss, low interoperability, and single points of failure.

## Solution

BlockID stores only verifiable proofs on-chain while keeping sensitive files off-chain. Users register a DID tied to their wallet, upload encrypted metadata and documents to decentralized storage, and approve verification requests from authorized institutions such as banks, colleges, and government offices.

## Core Features

- DID registration with deterministic identifier generation
- Solidity smart contract with lifecycle management
- Role-based verification for institutions
- Wallet signature authentication and challenge-response login
- IPFS/Pinata-ready document upload flow
- Encrypted metadata and proof hashing
- ZKP-style selective disclosure simulation
- OTP-based secondary verification for demo simplicity
- React dashboards for users, organizations, and admins
- Audit logs and verification history

## Monorepo

- `contracts/`: Hardhat project and Solidity contract
- `backend/`: Express API, auth, IPFS hooks, DID services
- `frontend/`: React + Vite + Tailwind application
- `docs/`: architecture, demo notes, viva support

## Quick Start

1. Install dependencies in each app:
   - `cd contracts && npm install`
   - `cd ../backend && npm install`
   - `cd ../frontend && npm install`
2. Copy `.env.example` to `.env` in `contracts`, `backend`, and `frontend`.
3. Start Hardhat local chain and deploy the contract.
4. Start backend on `http://localhost:4000`.
5. Start frontend on `http://localhost:5173`.

Detailed setup is in `docs/DEPLOYMENT.md`.

## Future Scope

- Real ZK proofs with Semaphore/Polygon ID
- Verifiable credentials and revocation registries
- WebAuthn/passkey based biometric fallback
- Multi-chain deployments
- IPFS encryption with threshold key sharing
