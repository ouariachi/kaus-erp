import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const sessionStore = new (connectPgSimple(session))({
  createTableIfMissing: true,
  pruneSessionInterval: 60 * 60 * 12,
  pool,
});

sessionStore.pruneSessions();

export const sessionMiddleware = session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  cookie: {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
});
