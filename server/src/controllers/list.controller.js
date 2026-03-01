import prisma from "../prisma.js";

class ListController{
    async createList(req, res) {
        try {
            const boardId = parseInt(req.params.boardId);
            const { title, accent } = req.body;
            const maxPos = await prisma.list.aggregate({ where: { boardId }, _max: { position: true } });
            const list = await prisma.list.create({
                data: { title, accent: accent || "sun", position: (maxPos._max.position ?? -1) + 1, boardId },
            });
            return res.status(201).json(list);
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    async updateList(req, res) {
        try {
            const { title, accent } = req.body;
            const data = {};

            if (title !== undefined) data.title = title;
            if (accent !== undefined) data.accent = accent;
            const list = await prisma.list.update({ where: { id: parseInt(req.params.id) }, data });
            return res.json(list);
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    async reorderLists(req, res) {
    try {
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: "Invalid orderedIds" });
        }

        const updates = orderedIds.map((id, index) =>
            prisma.list.update({
                where: { id: parseInt(id) },
                data: { position: index }
            })
        );

        await prisma.$transaction(updates);

        return res.json({ message: "Lists reordered successfully" });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
    async deleteList(req, res) {
        try {
            await prisma.list.update({ where: { id: parseInt(req.params.id) }, data: { archived: true } });
            return res.json({ message: "List archived" });
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
}

export default new ListController();