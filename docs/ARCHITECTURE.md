# BlockID Architecture

## High-Level Architecture

```mermaid
flowchart LR
    U[User Wallet + Browser] --> F[React Frontend]
    O[Organization Dashboard] --> F
    A[Admin Dashboard] --> F
    F --> MM[MetaMask]
    F --> B[Express API]
    B --> DB[(MongoDB/PostgreSQL Optional Metadata)]
    B --> P[Pinata / IPFS]
    B --> C[OTP / Challenge Service]
    F --> SC[Solidity IdentityRegistry Contract]
    B --> SC
    SC --> CH[(Ethereum / Polygon Testnet)]
```

## Data Flow

1. User connects MetaMask and signs a nonce challenge.
2. Backend verifies the signature and issues a JWT.
3. User submits identity data and document files.
4. Backend encrypts sensitive metadata, hashes normalized fields, uploads encrypted payload/documents to IPFS, and returns IPFS CIDs plus proofs.
5. Frontend sends the registration transaction to the smart contract.
6. Contract stores only DID, wallet, hash pointers, timestamps, and lifecycle status.
7. Organization requests verification for a DID.
8. User approves the request and completes OTP-based step-up authentication.
9. Authorized verifier validates the proof and writes verification result on-chain.

## DID Generation Algorithm

`DID = "did:blockid:" + keccak256(walletAddress + normalizedEmail + collegeId).slice(0, 32)`

## Hashing Workflow

1. Normalize user fields.
2. Build canonical JSON payload.
3. Compute SHA-256 metadata hash.
4. Compute SHA-256 document hash for each uploaded file.
5. Build Merkle-like root by hashing concatenated metadata hash and document hashes.
6. Store only the root hash and CID references on-chain.

## Digital Signature Verification

1. Backend generates random nonce.
2. Wallet signs `BlockID authentication nonce: <nonce>`.
3. Backend recovers signer address using `ethers.verifyMessage`.
4. If recovered address matches claimed wallet address, JWT is issued.

## Smart Contract State Transitions

```mermaid
stateDiagram-v2
    [*] --> Unregistered
    Unregistered --> Registered: registerIdentity
    Registered --> PendingVerification: requestVerification
    PendingVerification --> Verified: verifyIdentity(true)
    PendingVerification --> Rejected: verifyIdentity(false)
    Verified --> Suspended: suspendIdentity
    Rejected --> PendingVerification: requestVerification
    Suspended --> Verified: restoreIdentity
    Registered --> Revoked: revokeIdentity
    Verified --> Revoked: revokeIdentity
    Suspended --> Revoked: revokeIdentity
```

## Verification Sequence

```mermaid
sequenceDiagram
    participant Org as Organization
    participant UI as Frontend
    participant API as Backend
    participant User as User
    participant SC as Smart Contract

    Org->>UI: Request DID verification
    UI->>API: Create verification request
    API-->>User: Notify pending request
    User->>UI: Approve request + OTP
    UI->>API: Submit approval
    API->>API: Validate hashes/proof/signature
    UI->>SC: Authorized verifier sends verify tx
    SC-->>UI: Verified/Rejected event
    UI-->>Org: Final status
```
