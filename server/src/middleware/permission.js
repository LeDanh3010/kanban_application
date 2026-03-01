import prisma from "../prisma.js";

const getBoardId = async (req) => {
    // /boards/:boardId/lists, /boards/:boardId/lists/reorder
    if (req.params.boardId) return parseInt(req.params.boardId);

    // /boards/:id (update, delete, share)
    if (req.params.id && req.baseUrl.includes("boards")) return parseInt(req.params.id);

    // /lists/:listId/cards
    if (req.params.listId) {
        const list = await prisma.list.findUnique({ where: { id: parseInt(req.params.listId) }, select: { boardId: true } });
        return list?.boardId;
    }

    // /lists/:id → tìm list → lấy boardId
    if (req.params.id && req.originalUrl.includes("/lists/")) {
        const list = await prisma.list.findUnique({ where: { id: parseInt(req.params.id) }, select: { boardId: true } });
        return list?.boardId;
    }

    // /cards/:id → tìm card → lấy boardId qua list
    if (req.params.id && req.originalUrl.includes("/cards/")) {
        const card = await prisma.card.findUnique({
            where: { id: parseInt(req.params.id) },
            select: { list: { select: { boardId: true } } },
        });
        return card?.list?.boardId;
    }

    // reorder (body chứa boardId)
    if (req.body.boardId) return parseInt(req.body.boardId);

    return null;
};


export const boardPermission = (allowedBoardRoles) => async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            req.boardRole = "admin";
            return next();
        }

        const boardId = await getBoardId(req);
        if (!boardId) return res.status(400).json({ error: "Cannot determine board" });

        const member = await prisma.boardMember.findUnique({
            where: { userId_boardId: { userId: req.user.id, boardId } },
        });

        if (!member) return res.status(403).json({ error: "You are not a member of this board" });

        if (!allowedBoardRoles.includes(member.role)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }

        req.boardRole = member.role;
        req.boardId = boardId;
        next();
    } catch (e) {
        return res.status(500).json({ error: "Permission check failed" });
    }
};


export const collaboratorFilter = async (req, res, next) => {
    try {
        if (req.boardRole !== "collaborator") return next();

        const cardId = parseInt(req.params.id);
        if (!cardId) return next();

        const assigned = await prisma.cardMember.findFirst({
            where: { cardId, userId: req.user.id },
        });

        if (!assigned) {
            return res.status(403).json({ error: "You can only access cards assigned to you" });
        }

        next();
    } catch (e) {
        return res.status(500).json({ error: "Permission check failed" });
    }
};