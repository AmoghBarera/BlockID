# Demo Flow

## Demo Flow

1. Open landing page and connect MetaMask.
2. Login by signing wallet nonce.
3. Register identity with personal data and document placeholders.
4. Backend generates DID, hashes metadata, simulates encrypted IPFS upload.
5. User submits registration transaction.
6. Admin authorizes verifier wallets.
7. Organization searches DID and creates verification request.
8. User approves request and completes OTP challenge.
9. Verifier marks identity as verified.
10. Admin reviews audit logs and can suspend or revoke identities.

## PPT-Ready Explanation

- Problem: centralized identity systems leak data and break interoperability.
- Innovation: DID + blockchain auditability + off-chain encrypted storage.
- Security: wallet signatures, SHA-256 hashing, role-based permissions, OTP challenge.
- Privacy: no raw PII on-chain, only hash, DID, CID, and status.
- Impact: reusable KYC, cross-organization trust, reduced fraud, faster onboarding.

## Viva Questions And Answers

1. Why not store raw identity data on-chain?
   Raw on-chain data is public, permanent, and expensive. We store only hashes, identifiers, and proofs.
2. What is a DID?
   A decentralized identifier is a self-controlled unique identity reference that does not depend on a single provider.
3. Why use IPFS?
   IPFS supports decentralized content addressing, making tamper detection easy through immutable hashes.
4. How is privacy preserved?
   Sensitive metadata is encrypted off-chain, hashed before registration, and selectively disclosed during verification.
5. Why is MetaMask used?
   It provides wallet ownership proof, signatures, and transaction authorization without passwords.
6. What is the role of the smart contract?
   It acts as the trust anchor for identity lifecycle state and verifier permissions.
7. How is authentication handled?
   Users sign a nonce with their wallet, backend verifies the signer, and JWT secures API sessions.
8. What is the ZKP component here?
   This prototype simulates selective disclosure by sharing proof claims without revealing full source documents.
9. Why choose OTP over facial recognition for the prototype?
   OTP is faster to demo, easier to set up in a hackathon environment, and still shows multi-factor verification.
10. Can this scale to real-world use?
   Yes, with verifiable credentials, production key management, regulated document attestation, and real ZK proof systems.
