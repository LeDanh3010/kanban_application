import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters"),
    role: z.enum(["admin","user"]),
});

export const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

// export const updateUserSchema = z.object({
//     username: z.string().min(3, "Username must be at least 3 characters").optional(),
//     password: z.string().min(8, "Password must be at least 8 characters").optional(),
// });