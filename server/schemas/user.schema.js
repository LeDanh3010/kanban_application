const {z} = require("zod")

const registerSchema = z.object({
    username: z.string().min(3,"Username must be at least 3 characters"),
    password: z.string().min(8,"Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[0-9]/, "Must contain number"),
    role: z.enum(["admin","leader","user","guest"])
})

const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8)
})

module.exports = {registerSchema,loginSchema}