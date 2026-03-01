import { Router } from "express";
import cardController from "../controllers/card.controller.js";
import { boardPermission, collaboratorFilter } from "../middleware/permission.js";

const router = Router();
const ALL_ROLES = ["leader", "assistant", "user", "collaborator", "guest"];

router.get("/cards/:id", boardPermission(ALL_ROLES), collaboratorFilter,cardController.getCard);
router.post("/lists/:listId/cards", boardPermission(["leader", "assistant"]),cardController.createCard);
router.put("/cards/:id", boardPermission(["leader", "assistant"]),cardController.updateCard);
router.delete("/cards/:id", boardPermission(["leader", "assistant"]),cardController.deleteCard);
router.put("/cards/reorder", boardPermission(["leader", "assistant", "user"]),cardController.reorderCards);
router.post("/cards/:id/members", boardPermission(["leader", "assistant"]),cardController.addMember);
router.post("/cards/:id/comments", boardPermission(ALL_ROLES), collaboratorFilter,cardController.addComment);

export default router;
