import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();
const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    next();
};

router.get("/", adminOnly, userController.getUsers);
router.get("/search", userController.searchUsers);
router.put("/:id", adminOnly, userController.updateUser);
router.delete("/:id", adminOnly, userController.deleteUser);

export default router;
