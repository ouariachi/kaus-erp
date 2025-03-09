import express from "express";
import cors from "cors";
import { sessionMiddleware } from "#src/middlewares/session";
import authRouter from "./core/auth/routes.js";
import adminRouter from "./core/admin/routes.js";
import { HTTP_MESSAGES } from "./utils/httpMessages.js";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { isAdmin } from "./utils/auth/userRole.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: JSON.stringify({ message: HTTP_MESSAGES[429] }),
  handler: (_, res) => res.status(429).json({ message: HTTP_MESSAGES[429] }),
  skip: (req) => { if(req.session && req.session.user) return isAdmin(req.session.user) },
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 500,
})

// middlewares
app.use(sessionMiddleware);
app.use(limiter);
app.use(speedLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));


// routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter)
app.get("/", (_, res) => res.json({ status: "ok" }));
app.get("*", (_, res) => res.status(404).json({ message: HTTP_MESSAGES[404] }));

export function initHTTP() {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}