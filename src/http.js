import express from "express";
import cors from "cors";
import { sessionMiddleware } from "#src/middlewares/session";
import authRouter from "./core/auth/routes.js";
import adminRouter from "./core/admin/routes.js";
import { HTTP_MESSAGES } from "./utils/httpMessages.js";

const PORT = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

// routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter)
app.get("/", (_, res) => res.json({ status: "ok" }));
app.get("*", (_, res) => res.status(404).json({ message: HTTP_MESSAGES[404] }));

export function initHTTP() {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}