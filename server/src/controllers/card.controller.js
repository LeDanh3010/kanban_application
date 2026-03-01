import prisma from "../prisma.js";
class CardController{
    async createCard(req,res){
        try {
            const listId = parseInt(req.params.listId);
            const {title} = req.body;
            const maxPos = await prisma.card.aggregate({ where: { listId }, _max: { position: true } });
            const card = await prisma.card.create({
                data: { title, position: (maxPos._max.position ?? -1) + 1, listId },
            });
            return res.status(201).json(card);
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
       async getCard(req, res) {
        try {
            const card = await prisma.card.findUnique({
                where: { id: parseInt(req.params.id) },
                include: {
                    labels: { include: { label: true } },
                    members: { include: { user: true } },
                    comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
                    checklists: { include: { items: { orderBy: { position: "asc" } } } },
                },
            });
            if (!card) return res.status(404).json({ error: "Card not found" });
            return res.json(card);
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
     async updateCard(req, res) {
        try {
            const { title, description, dueDate, completed } = req.body;
            const card = await prisma.card.update({
                where: { id: parseInt(req.params.id) },
                data: { title, description, dueDate, completed },
            });
            return res.json(card);
        } catch (e) {return res.status(500).json({ error: e.message });
    }
    }
     async reorderCards(req, res) {
        try {
            const { cards } = req.body;
            const updates = cards.map((c) => prisma.card.update({
                where: { id: c.id }, data: { listId: c.listId, position: c.position },
            }));
            await prisma.$transaction(updates);
            return res.json({ message: "Cards reordered" });
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
    async deleteCard(req, res) {
        try {
            await prisma.card.update({ where: { id: parseInt(req.params.id) }, data: { archived: true } });
            return res.json({ message: "Card archived" });
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
    async addMember(req, res) {
        try {
            const cardId = parseInt(req.params.id);
            const { userId } = req.body;
            const member = await prisma.cardMember.create({ data: { cardId, userId } });
            return res.status(201).json(member);
        } catch (e) {
            if (e.code === "P2002") return res.status(400).json({ error: "Already added" });
            return res.status(500).json({ error: e.message });
        }
    }
    async addComment(req, res) {
        try {
            const cardId = parseInt(req.params.id);
            const { content } = req.body;
            const comment = await prisma.comment.create({
                data: { content, cardId, userId: req.user.id },
                include: { user: true },
            });
            return res.status(201).json(comment);
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
}

export default new CardController();