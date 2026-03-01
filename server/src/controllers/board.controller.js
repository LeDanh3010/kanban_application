import prisma from "../prisma.js";

class BoardController {
    async getBoards(req, res) {
        try {
            const where = req.user.role === "admin"
                ? { archived: false }
                : { members: { some: { userId: req.user.id } }, archived: false };
            const boards = await prisma.board.findMany({
                where,
                include: {
                    lists: {
                        where: { archived: false },
                        orderBy: { position: "asc" },
                        include: {
                            cards: {
                                where: { archived: false },
                                orderBy: { position: "asc" },
                            },
                        },
                    },
                },
                orderBy: { position: "asc" },
            });
            return res.json(boards);
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getBoard(req, res) {
        try {
            const board = await prisma.board.findUnique({
                where: { id: parseInt(req.params.id) },
                include: {
                    lists: {
                        where: { archived: false },
                        orderBy: { position: "asc" },
                        include: {
                            cards: {
                                where: { archived: false },
                                orderBy: { position: "asc" },
                                include: {
                                    labels: { include: { label: true } },
                                    members: { include: { user: true } },
                                },
                            },
                        },
                    },
                    labels: true,
                    members: { include: { user: true } },
                },
            });
            if (!board) return res.status(404).json({ error: "Board not found" });
            return res.json(board);
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async createBoard(req, res) {
        try {
            const { title, accent, coverUrl } = req.body;
            const board = await prisma.board.create({
                data: {
                    title,
                    accent: accent || "sun",
                    coverUrl,
                    members: { create: { userId: req.user.id } },
                },
                include: { members: true },
            });
            return res.status(201).json(board);
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async updateBoard(req, res) {
        try {
            const { title, accent, coverUrl } = req.body;
            const board = await prisma.board.update({
                where: { id: parseInt(req.params.id) },
                data: { title, accent, coverUrl },
            });
            return res.json(board);
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async archiveBoard(req, res) {
        try {
            await prisma.board.update({
                where: { id: parseInt(req.params.id) },
                data: { archived: true },
            });
            return res.json({ message: "Board archived" });
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async shareBoard(req, res) {
        try {
            const boardId = parseInt(req.params.id);
            const { userId, role } = req.body;

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ error: "User not found" });

            const member = await prisma.boardMember.create({
                data: { boardId, userId, role: role || "user" },
            });
            return res.status(201).json(member);
        } catch (e) {
            if (e.code === "P2002") return res.status(400).json({ error: "User already in board" });
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default new BoardController();