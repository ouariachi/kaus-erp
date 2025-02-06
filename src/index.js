import "./db.js";
import { configDotenv } from "dotenv";
import { initHTTP } from "./http.js";

configDotenv();
initHTTP();