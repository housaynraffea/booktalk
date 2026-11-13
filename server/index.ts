import express, { response } from "express";
import cors from "cors";
import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv";
import { error } from "console";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { createAuthRouter, requireLogin } from "./auth";

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

app.get("/api", async(request, result) => {
    try {
        result.json({ status: "ok" });
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
});

app.get("/books/search", async(request, response) => {
    const searchText = String(request.query.q ?? "");
    const searchLimit = Math.min(Number(request.query.limit) || 15, 20);
    const words = searchText
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
    if (words.length === 0 || words.join("").length < 3) {
        response.json({ books: [] });
        return;
    }
    
    const tsQuery = words
    .map((word, index) => (index === words.length - 1 ? `${word}:*` : word))
    .join(" & ");
    
    try {
        const result = await pool.query(
            `SELECT key, title, authors, cover
            FROM "BOOK"
            WHERE search @@ to_tsquery('simple', $1)
            LIMIT $2`,
            [tsQuery, searchLimit]
        );
        
        response.json({ books: result.rows });
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Book search failed" });
    }
});

app.get("/books/:key", async(request, response) => {
    try {
        const result = await pool.query(
            `SELECT key, title, authors, cover, description
            FROM "BOOK"
            WHERE key = $1`,
            [request.params.key]
        );

        if (result.rows.length === 0) {
            response.status(404).json({ error: "Not found" });
            return;
        }
        
        response.json(result.rows[0]);
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Book search failed!" });
    }
});

app.get("/books/:key/reviews", async(request, response) => {
    try {
        const result = await pool.query(
            `SELECT r.review_id, r.stars, r.likes,
                    r.description, r.created_at, a.account_id,
                    a.username, a.display_name
            FROM "REVIEW" r
            JOIN "ACCOUNT" a ON a.account_id = r.account_id
            WHERE r.book_key = $1
            ORDER BY r.created_at DESC
            LIMIT 50`,
            [request.params.key]);
        response.json(result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Could not load reviews!" });
    }
});

app.get("/accounts/search", async(request, response) => {
    const searchText = String(request.query.q ?? "").trim().replace(/^@/, "");
    const searchLimit = Math.min(Number(request.query.limit) || 15, 20);
    
    if (searchText.length < 1) {
        response.json({ accounts: [] });
        return;
    }

    const escapedText = searchText.replace(/[\\%_]/g, "\\$&");

    try {
        const result = await pool.query(
            `SELECT account_id, username, display_name
            FROM "ACCOUNT"
            WHERE username ILIKE $1 OR display_name ILIKE $1
            ORDER BY username
            LIMIT $2`,
            [`${escapedText}%`, searchLimit]
        );
        
        response.json({ accounts: result.rows });
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Search failed!" });
    }
});

app.get("/accounts/username-available", async (request, response) => {
    const username = String(request.query.username ?? "").trim();

    if (username.length < 3 || username.length > 32 || !/^[A-Za-z0-9_]+$/.test(username)){
        response.status(400).json({ error: "Invalid username" });
    }

    try {
        const result = await pool.query(
            `SELECT 1 FROM "ACCOUNT" WHERE lower(username) = lower($1)`,
            [username]
        );

        response.json({ available: result.rows.length === 0 });
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Username check failed!" });
    }
});

app.get("/accounts/:account_id", async(request, response) => {
    const accountId = Number(request.params.account_id);
    
    if (!Number.isInteger(accountId)) {
        response.status(400).json({ error: "Invalid Account Id" });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT a.account_id, a.username, a.display_name, 
                    a.bio, a.favourite_book_key, a.created_at,
                    b.title AS favourite_book_title,
                    b.cover AS favourite_book_cover
            FROM "ACCOUNT" a
            LEFT JOIN "BOOK" b ON b.key = a.favourite_book_key
            WHERE a.account_id = $1`,
            [accountId]
        );
        
        if (result.rows.length === 0) {
            response.status(404).json({ error: "Not found" });
            return;
        }

        response.json(result.rows[0]);
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Could not load account!!" });
    }
});

app.get("/accounts/:account_id/reviews", async(request, response) => {
    const account_id = Number(request.params.account_id);

    if (!Number.isInteger(account_id)) {
        response.status(400).json({ error: "Invalid Account Id" });
        return;
    }
    
    try {
        const result = await pool.query(
            `SELECT r.review_id, r.book_key, r.stars, r.likes, 
                    r.description, r.created_at, b.title,
                    b.authors, b.cover
            FROM "REVIEW" r
            JOIN "BOOK" b ON b.key = r.book_key
            WHERE r.account_id = $1
            ORDER BY r.created_at DESC
            LIMIT 50`, 
            // one flaw here is that this could potentially 
            // mess with accounts who have more than 50 
            // reviews and can't see their oldest reviews
            [request.params.account_id]);
        response.json({ reviews: result.rows});
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Could not load reviews!" });
    }
});

app.get("/accounts/by-username/:username", async (request, response) => {
    const username = request.params.username;

    if (!/^[A-Za-z0-9_]+$/.test(username)) {
        response.status(404).json({ error: "Account not found!" });
    }

    try {
        const result = await pool.query(`
            SELECT a.account_id, a.username, a.display_name,
                   a.bio, a.favourite_book_key, a.created_at,
                   b.title AS favourite_book_title,
                   b.cover AS favourite_book_cover
            FROM "ACCOUNT" a
            LEFT JOIN "BOOK" b ON b.key = a.favourite_book_key
            WHERE lower(a.username) = lower($1)`,
            [username]);
        
        if (result.rows.length === 0) {
            response.status(404).json({ error: "Account not found!" });
        }

        response.json(result.rows[0]);
    } 
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Invalid account username" });
    }
});

app.get("/comments/:review_id", async(request, response) => {
    const reviewId = Number(request.params.review_id);

    if (!Number.isInteger(reviewId)) {
        response.status(400).json({ error: "Invalid Review Id" });
        return;
    }
    
    try {
        const result = await pool.query(
            `SELECT c.comment_id, c.comment, c.likes,
                    c.dislikes, c.created_at, a.account_id,
                    a.username, a.display_name
            FROM "COMMENT" c
            JOIN "ACCOUNT" a ON a.account_id = c.account_id
            WHERE c.review_id = $1
            ORDER BY c.created_at
            LIMIT 100`,
            [reviewId]);
        response.json({ comment: result.rows });
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Could not load comments!" });
    }
});

app.patch("/accounts/me", requireLogin, async (request, response) => {
    const account_id = request.session.account_id as number;
    const display_name = String(request.body?.display_name ?? "").trim();
    const username = String(request.body?.username ?? "").trim();
    const bio = String(request.body?.bio ?? "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    const favourite_book_key = request.body?.favourite_book_key ? String(request.body.favourite_book_key).trim() : null;

    if (display_name.length < 3 || display_name.length > 64) {
        response.status(400).json({ error: "Display name must be between 3-64 characters!" });
        return;
    }

    if (!/^[A-Za-z0-9_]{3,32}$/.test(username)) {
        response.status(400).json({ error: "Username can only contain letters, numbers and underscores, and must only be between 3-32 characters!" });
        return;
    }

    if (bio.length > 500) {
        response.status(400).json({ error: "Bio must be under 500 characters!" });
        return;
    }

    try {
        const result = await pool.query(`
            UPDATE "ACCOUNT"
            SET display_name = $1, username = $2, bio = $3, favourite_book_key = $4
            WHERE account_id = $5
            RETURNING account_id, username, display_name, bio, favourite_book_key`, 
            [display_name, username, bio === "" ? null : bio, favourite_book_key, account_id]
        );

        response.json(result.rows[0]);
    }
    catch (error) {
        const db_error = error as { code?: string };
        if (db_error.code === "23505") {
            response.status(409).json({ error: "Username is taken!" });
        }

        if (db_error.code === "23503") {
            response.status(409).json({ error: "Book does not exist!" });
        }

        console.log("Account update error! Error:", error);
        response.status(500).json({ error: "Could not save your changes" });
    }
});

app.listen(3000, () => { console.log("API on http://localhost:3000") });

// run this command in the terminal:
// npx tsx index.ts