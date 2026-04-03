import {
  approveVerificationRequest,
  createVerificationRequest,
  finalizeVerification,
  getIdentity,
  getVerificationRequests,
  listIdentities,
  registerIdentity,
  revokeIdentity
} from "../services/identityService.js";
import { getAuditLogs } from "../services/auditService.js";

export async function createIdentity(req, res) {
  try {
    const identity = await registerIdentity(req.user.walletAddress, req.body, req.files || []);
    res.status(201).json(identity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export function fetchIdentity(req, res) {
  const identity = getIdentity(req.params.did);
  if (!identity) return res.status(404).json({ message: "Identity not found" });
  res.json(identity);
}

export function fetchIdentities(_req, res) {
  res.json(listIdentities());
}

export function createRequest(req, res) {
  try {
    const request = createVerificationRequest(
      req.body.did,
      req.user.walletAddress,
      req.body.organizationName,
      req.body.purpose
    );
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export function approveRequest(req, res) {
  try {
    const request = approveVerificationRequest(req.params.requestId, req.user.walletAddress, req.body.otp);
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export function verifyRequest(req, res) {
  try {
    const result = finalizeVerification(
      req.params.requestId,
      req.user.walletAddress,
      req.body.approved,
      req.body.remarks
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export function revoke(req, res) {
  try {
    const identity = revokeIdentity(req.params.did, req.user.walletAddress);
    res.json(identity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export function listRequests(_req, res) {
  res.json(getVerificationRequests());
}

export function listAudit(_req, res) {
  res.json(getAuditLogs());
}
