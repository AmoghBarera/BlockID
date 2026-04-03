import { Router } from "express";
import { requestNonce, updateRole, verifySignature } from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/nonce", requestNonce);
router.post("/verify", verifySignature);
router.post("/role", requireAuth, requireRole("admin"), updateRole);

export default router;
