import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/register", authenticateToken, requireAdmin, authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.put("/change-password", authenticateToken, authController.changePassword);

export default router;
