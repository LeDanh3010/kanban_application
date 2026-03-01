import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import registerRoutes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.static(join(__dirname, "../public")));

// Routes
registerRoutes(app);


// app.use((req,res)=>{
//     res.send("404 not found")
// })
// Health check
app.get("/api/health", (req, res) =>
    res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
