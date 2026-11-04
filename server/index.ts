import express from "express";
import cors from "cors";
import { Pool } from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

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
                    b.title AS favourite_book_title
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
    
    if (!Number.isInteger(request.params.account_id)) {
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
        response.json(result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        response.status(500).json({ error: "Could not load reviews!" });
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

app.listen(3000, () => { console.log("API on http://localhost:3000") });

// run this command in the terminal:
// npx tsx index.ts