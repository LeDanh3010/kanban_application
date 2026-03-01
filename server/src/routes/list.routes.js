import { Router } from "express";
import listController from "../controllers/list.controller.js";
import { boardPermission } from "../middleware/permission.js";

const router = Router();

router.post("/boards/:boardId/lists",boardPermission(["leader"]),listController.createList);
router.put("/lists/:id",boardPermission(["leader"]),listController.updateList);
router.delete("/lists/:id",boardPermission(["leader"]),listController.deleteList);
router.put("/boards/:boardId/lists/reorder", boardPermission(["leader", "assistant", "user"]),listController.reorderLists);

export default router;
