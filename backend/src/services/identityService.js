import { db } from "../models/store.js";
import { buildProofHash, generateDid } from "../utils/did.js";
import { generateOtp } from "../utils/crypto.js";
import { uploadIdentityPayload } from "./ipfsService.js";
import { recordAudit } from "./auditService.js";

export async function registerIdentity(walletAddress, identityInput, files) {
  const did = generateDid({
    walletAddress,
    email: identityInput.email,
    collegeId: identityInput.collegeId
  });

  const upload = await uploadIdentityPayload(identityInput, files);
  const proofHash = buildProofHash(identityInput, upload.documentHashes);

  const identity = {
    did,
    walletAddress,
    fullName: identityInput.fullName,
    dateOfBirth: identityInput.dateOfBirth,
    collegeId: identityInput.collegeId,
    email: identityInput.email,
    phone: identityInput.phone,
    metadataCid: upload.metadataCid,
    proofHash,
    status: "REGISTERED",
    documentManifest: upload.documents,
    createdAt: new Date().toISOString(),
    zkpClaim: {
      ageOver18: true,
      collegeVerified: Boolean(identityInput.collegeId)
    }
  };

  db.identities.set(did, identity);
  recordAudit("IDENTITY_REGISTERED", walletAddress, { did });
  return identity;
}

export function getIdentity(did) {
  return db.identities.get(did);
}

export function listIdentities() {
  return Array.from(db.identities.values());
}

export function createVerificationRequest(did, requestedBy, organizationName, purpose) {
  const identity = getIdentity(did);
  if (!identity) throw new Error("Identity not found");

  const request = {
    id: `vr-${Date.now()}`,
    did,
    requestedBy,
    organizationName,
    purpose,
    status: "PENDING_USER_APPROVAL",
    otp: generateOtp(),
    createdAt: new Date().toISOString()
  };

  db.verificationRequests.set(request.id, request);
  recordAudit("VERIFICATION_REQUESTED", requestedBy, { did, requestId: request.id });
  return request;
}

export function approveVerificationRequest(requestId, actor, otp) {
  const request = db.verificationRequests.get(requestId);
  if (!request) throw new Error("Request not found");
  if (request.otp !== otp) throw new Error("Invalid OTP");

  request.status = "APPROVED_BY_USER";
  request.approvedBy = actor;
  request.approvedAt = new Date().toISOString();
  recordAudit("VERIFICATION_APPROVED", actor, { requestId });
  return request;
}

export function finalizeVerification(requestId, verifier, approved, remarks) {
  const request = db.verificationRequests.get(requestId);
  if (!request) throw new Error("Request not found");

  const identity = getIdentity(request.did);
  identity.status = approved ? "VERIFIED" : "REJECTED";

  request.status = approved ? "VERIFIED" : "REJECTED";
  request.verifiedBy = verifier;
  request.verifiedAt = new Date().toISOString();
  request.remarks = remarks;

  recordAudit("VERIFICATION_FINALIZED", verifier, { requestId, approved });
  return { request, identity };
}

export function revokeIdentity(did, actor) {
  const identity = getIdentity(did);
  if (!identity) throw new Error("Identity not found");
  identity.status = "REVOKED";
  recordAudit("IDENTITY_REVOKED", actor, { did });
  return identity;
}

export function getVerificationRequests() {
  return Array.from(db.verificationRequests.values());
}
