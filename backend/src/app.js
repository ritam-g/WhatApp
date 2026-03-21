import express from "express";
import cors from "cors";
import messageRoutes from "./routes/message.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/messages", messageRoutes);

export default app;