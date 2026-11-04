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
}

verifyConnection();

//#region API

app.get("/api", async(request, result) => {
    try {
        result.json({ status: "ok" });
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
})

app.get("/api/test", async(request, result) => {
    try {
        const _result = await pool.query('SELECT * FROM "TEST"');
        result.json(_result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
})

app.get("/api/account", async(request, result) => {
    try {
        const _result = await pool.query('SELECT * FROM "ACCOUNT"');
        result.json(_result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
})

app.get("/api/book", async(request, result) => {
    try {
        const _result = await pool.query('SELECT * FROM "BOOK" LIMIT 1000');
        result.json(_result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
})

app.get("/api/comment", async(request, result) => {
    try {
        const _result = await pool.query('SELECT * FROM "COMMENT"');
        result.json(_result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
})

app.get("/api/review", async(request, result) => {
    try {
        const _result = await pool.query('SELECT * FROM "REVIEW"');
        result.json(_result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        result.status(500).json({ error: "Database error!" });
    }
})

//#endregion

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
        response.status(500).json({ error: "Search failed" });
    }
})

app.listen(3000, () => { console.log("API on http://localhost:3000") });

// run this command in the terminal:
// npx tsx index.ts