import prisma from "../prisma.js";
import bcrypt from "bcryptjs";

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

   async updateUser(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const { username, role, password } = req.body;

    const dataToUpdate = {};

    if (username) dataToUpdate.username = username;
    if (role) dataToUpdate.role = role;

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        role: true,
        firstLogin: true,
        createdAt: true
      }
    });

    return res.json(user);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

    async deleteUser(req, res) {
        try {
            await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
            return res.json({ message: "User deleted" });
        } catch (e) { return res.status(500).json({ error: e.message }); }
    }

    async searchUsers(req, res) {
        try {
            const { q } = req.query;
            if (!q) return res.json([]);
            const users = await prisma.user.findMany({
                where: {
                    username: { contains: q, mode: 'insensitive' }
                },
                select: { id: true, username: true, role: true },
                take: 10
            });
            return res.json(users);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }
}

export default new UserController();
