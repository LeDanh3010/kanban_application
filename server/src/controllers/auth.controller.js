const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const { registerSchema, loginSchema } = require("../../schemas/user.schema");

class AuthController {
    async register(req,res){
        try{
            const {username, password,role} = req.body;

            //Validate input
            const validation = registerSchema.safeParse({username,password,role})
            if(!validation.success) return res.status(400).json({error:validation.error.errors})

            //Check if user exists
            const existing = await prisma.user.findFirst({
                where:{
                    username:username
                }
            })
            if(existing) return res.status(400).json({error:"User already exists"})
            
            //Hash password
            const hashedPassword = await bcrypt.hash(password,10)

            //create user in db
            const user = await prisma.user.create({
                data:{
                    username:username,
                    passwordHash:hashedPassword,
                    role:role
                }
            })

            return res.status(201).json({
                    id: user.id,
                    username: user.username,
                    role: user.role
            })
        }catch(e){
            console.log(e)
            return res.status(500).json({error:"Internal server error"})
        }
    }

    ///////////////////////////////login
    async login(req,res){
        try{
            const {username, password} = req.body;

            //Validate input
            const validation = loginSchema.safeParse({username,password})
            if(!validation.success) return res.status(400).json({error:validation.error.errors})

            //Check if user exists
            const user = await prisma.user.findUnique({
                where:{
                    username:username
                }
            })
            if(!user) return res.status(404).json({error: "Invalid credentials"})

            //Check password
            const isPasswordValid = await bcrypt.compare(password,user.passwordHash)
            if(!isPasswordValid) return res.status(401).json({error:"Invalid credentials"})

            //payload
            const payload ={
                id:user.id,
                username:user.username,
                role:user.role
            }

            //Generate tokens
            const accessToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"15m"})
            const refreshToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"30d"})

            //Store refresh token
            await prisma.refreshToken.create({
                data:{
                    token:refreshToken,
                    userId:user.id
                }
            })

            return res.status(200).json({
                accessToken,
                refreshToken,
                user:{
                    id:user.id,
                    username:user.username,
                    role:user.role
                }
            })
        }catch(e){
            console.log(e)
            return res.status(500).json({error:"Internal server error"})
        }
    }
    /////////////////////refresh token
    async refreshToken(req,res){
        try{
            const {refreshToken} =req.body;
            if(!refreshToken) return res.status(401).json({error:"Refresh token is not provided"})
            
            const stored = await prisma.refreshToken.findUnique({
                where:{
                    token:refreshToken
                }
            })
            if(!stored || stored.revoked){
                return res.status(403).json({error:"Invalid refresh token"})
            }

            //verify token
            const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);

            const user = await prisma.user.findUnique({
                where:{
                    id:decoded.id
                }
            })
            if(!user) return res.status(404).json({error:"User not found"})
            
            //delete refresh token
            await prisma.refreshToken.delete({
                where:{
                    id:stored.id
                }
            })

            const payload = {
                id:user.id,
                username:user.username,
                role:user.role
            }

            const newAccessToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"15m"})
            const newRefreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:"30d"})

            await prisma.refreshToken.create({
                data:{
                    token:newRefreshToken,
                    userId:user.id,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                }
            })

            return res.status(200).json({
                accessToken:newAccessToken,
                refreshToken:newRefreshToken,
            })
            
        }catch(e){
            console.log(e)
            return res.status(500).json({error:"Internal server error"})
        }
    }
}
module.exports = new AuthController();