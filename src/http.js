import express from "express";
import cors from "cors";
import { sessionMiddleware } from "#src/middlewares/session";
import authRouter from "./modules/auth/routes.js";
import path from "path";

const PORT = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));

// routes
app.use("/", express.static(path.join(process.cwd(), "src/public")));
app.use("/auth", authRouter);
app.get("/api", (_, res) => {
  res.json({ status: "ok" });
});

export function initHTTP() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export function getApp() {
  return app;
}