import {Router} from "express";
import boardController from "../controllers/board.controller.js";
import {boardPermission} from "../middleware/permission.js";
const router = Router();
const ALL_ROLES = ["leader","assistant","user","collaborator"];

const adminOnly = (req,res,next)=>{
    if(req.user.role !== "admin") return res.status(403).json({error:"admin only"});
    next();
}

router.get("/",boardController.getBoards);
router.get("/:id",boardPermission(ALL_ROLES),boardController.getBoard);
router.post("/",adminOnly,boardController.createBoard)
router.put("/:id",adminOnly,boardController.updateBoard)
router.delete("/:id",adminOnly,boardController.archiveBoard)
router.post("/:id/share",adminOnly,boardController.shareBoard)




export default router;