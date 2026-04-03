import { Router } from "express";
import multer from "multer";
import {
  approveRequest,
  createIdentity,
  createRequest,
  fetchIdentities,
  fetchIdentity,
  listAudit,
  listRequests,
  revoke,
  verifyRequest
} from "../controllers/identityController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/identities", requireAuth, fetchIdentities);
router.get("/identities/:did", requireAuth, fetchIdentity);
router.post("/identities", requireAuth, upload.array("documents", 5), createIdentity);
router.post("/requests", requireAuth, requireRole("org", "admin"), createRequest);
router.get("/requests", requireAuth, listRequests);
router.post("/requests/:requestId/approve", requireAuth, approveRequest);
router.post("/requests/:requestId/verify", requireAuth, requireRole("org", "admin"), verifyRequest);
router.post("/identities/:did/revoke", requireAuth, requireRole("admin"), revoke);
router.get("/audit-logs", requireAuth, requireRole("admin"), listAudit);

export default router;
