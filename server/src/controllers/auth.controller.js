import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { registerSchema, loginSchema } from "../../schemas/user.schema.js";

class AuthController {
    async register(req, res) {
        try {
            const { username, password, role } = req.body;

            // Validate input
            const validation = registerSchema.safeParse({ username, password, role });
            if (!validation.success) return res.status(400).json({ error: validation.error.errors });

            // Check if user exists
            const existing = await prisma.user.findFirst({ where: { username } });
            if (existing) return res.status(400).json({ error: "User already exists" });

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user in db
            const user = await prisma.user.create({
                data: { username, passwordHash: hashedPassword, role },
            });

            return res.status(201).json({ id: user.id, username: user.username, role: user.role });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validate input
            const validation = loginSchema.safeParse({ username, password });
            if (!validation.success) return res.status(400).json({ error: validation.error.errors });

            // Check if user exists
            const user = await prisma.user.findUnique({ where: { username } });
            if (!user) return res.status(404).json({ error: "Invalid credentials" });

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

            // Payload
            const payload = { id: user.id, username: user.username, role: user.role };

            // Generate tokens
            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

            // Store refresh token in db
            await prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });

            // Send refreshToken via HttpOnly Cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
                path: "/api/auth",
            });

            return res.status(200).json({
                accessToken,
                user: { id: user.id, username: user.username, role: user.role, firstLogin: user.firstLogin },
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).json({ error: "Refresh token is not provided" });

            const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
            if (!stored || stored.revoked) return res.status(403).json({ error: "Invalid refresh token" });

            // Verify token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) return res.status(404).json({ error: "User not found" });

            // Delete old refresh token
            await prisma.refreshToken.delete({ where: { id: stored.id } });

            const payload = { id: user.id, username: user.username, role: user.role };
            const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
            const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

            await prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
                path: "/api/auth",
            });

            return res.status(200).json({ accessToken: newAccessToken });
        } catch (e) {
            console.log(e);
            return res.status(403).json({ error: "Invalid or expired refresh token" });
        }
    }

    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                await prisma.refreshToken.updateMany({
                    where: { token: refreshToken },
                    data: { revoked: true },
                });
            }
            res.clearCookie("refreshToken", { path: "/api/auth" });
            return res.status(200).json({ message: "Logged out successfully" });
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async changePassword(req, res) {
        try {
            const { newPassword } = req.body;
            if (!newPassword || newPassword.length < 8) {
                return res.status(400).json({ error: "New password must be at least 8 characters" });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: req.user.id },
                data: { passwordHash: hashedPassword, firstLogin: false },
            });
            return res.status(200).json({ message: "Password changed successfully" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default new AuthController();