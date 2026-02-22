const jwt = require("jsonwebtoken");
const authenticateToken = (req,res,next)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) return res.status(401).json({error:"Token is not provided"})
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(e) {
    return res.status(403).json({error:"Token is not valid or expired"})
}

}
const requireAdmin = (req,res,next)=>{
    if(req.user.role !== "admin") return res.status(403).json({error:"Admin access required"})
    next();
}

module.exports = {authenticateToken, requireAdmin}