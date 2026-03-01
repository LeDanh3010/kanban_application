import prisma from "../prisma.js";

class UserController {
    async getUsers(req, res) {
        try {
            const users = await prisma.user.findMany({
                select: { id: true, username: true, role: true, firstLogin: true, createdAt: true },
                orderBy: { createdAt: "asc" },
            });
            return res.json(users);
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    async updateUserRole(req, res) {
        try {
            const { role } = req.body;
            const user = await prisma.user.update({
                where: { id: parseInt(req.params.id) }, data: { role },
                select: { id: true, username: true, role: true },
            });
            return res.json(user);
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    async deleteUser(req, res) {
        try {
            await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
            return res.json({ message: "User deleted" });
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }
}

export default new UserController();
