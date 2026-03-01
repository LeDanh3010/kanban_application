import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const hash = await bcrypt.hash("Admin@123", 10);

    const admin = await prisma.user.upsert({
        where: { username: "admin" }, update: {},
        create: { username: "admin", passwordHash: hash, role: "admin", firstLogin: false },
    });
    const userA = await prisma.user.upsert({
        where: { username: "userA" }, update: {},
        create: { username: "userA", passwordHash: hash, role: "user" },
    });
    const userB = await prisma.user.upsert({
        where: { username: "userB" }, update: {},
        create: { username: "userB", passwordHash: hash, role: "user" },
    });
    const userC = await prisma.user.upsert({
        where: { username: "userC" }, update: {},
        create: { username: "userC", passwordHash: hash, role: "user" },
    });

    await prisma.board.create({
        data: {
            title: "Product Launch", accent: "sun",
            members: { create: [
                { userId: userA.id, role: "leader" },
                { userId: userB.id, role: "assistant" },
                { userId: userC.id, role: "collaborator" },
            ]},
            lists: { create: [
                { title: "To Do", position: 0, cards: { create: [
                    { title: "Design mockup", position: 0 },
                    { title: "Setup database", position: 1 },
                ]}},
                { title: "In Progress", accent: "sky", position: 1, cards: { create: [
                    { title: "Build API", position: 0 },
                ]}},
                { title: "Done", accent: "moss", position: 2 },
            ]},
        },
    });

    console.log("✅ Seed: admin / userA / userB / userC — password: Admin@123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
