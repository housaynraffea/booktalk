import express from "express";
import cors from "cors";
import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { createAuthRouter } from "./auth";
import { createReviewRouter } from "./review.ts";
import { createBookRouter } from "./book.ts";
import { createAccountRouter } from "./account.ts";

// run this command in the terminal:
// npx tsx index.ts

// if you want to see it update dynamically:
// tsx watch index.ts

dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET missing from .env file!");
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const pg_session = connectPgSimple(session);

async function verifyConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL Database!");
        console.log("Database host:", process.env.DB_HOST);
        console.log("Database port:", process.env.DB_PORT);
        console.log("Database name:", process.env.DB_NAME);
        console.log("Database user:", process.env.DB_USER);
        client.release();
    }
    catch (error) {
        console.error("Error connecting to PostgreSQL Database:", error);
    }
};

verifyConnection();

app.use(session({
    store: new pg_session({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7*24*60*60*1000,
    },
}));

app.use("/auth", createAuthRouter(pool));
app.use("/accounts", createAccountRouter(pool));
app.use("/books", createBookRouter(pool));
app.use("/reviews", createReviewRouter(pool));

app.get("/api", async(request, result) => {
    try {
        result.json({ status: "ok" });
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
});

app.listen(3000, () => { console.log("API on http://localhost:3000") });