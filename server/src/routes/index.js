import authRoutes from "./auth.routes.js";
import boardRoutes from "./board.routes.js";
import listRoutes from "./list.routes.js";
import cardRoutes from "./card.routes.js";
import userRoutes from "./user.routes.js";
import { authenticateToken } from "../middleware/auth.js";

const registerRoutes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/boards", authenticateToken, boardRoutes);
    app.use("/api", authenticateToken, listRoutes);
    app.use("/api", authenticateToken, cardRoutes);
    app.use("/api/users", authenticateToken, userRoutes);
};

export default registerRoutes;
