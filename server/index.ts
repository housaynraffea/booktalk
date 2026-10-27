import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: process.env.VITE_DB_HOST,
    port: Number(process.env.VITE_DB_PORT),
    database: process.env.VITE_DB_NAME,
    user: process.env.VITE_DB_USER,
    password: process.env.VITE_DB_PASSWORD,
});

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

async function verifyConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL Database!");
        console.log("Database host:", process.env.VITE_DB_HOST);
        console.log("Database port:", process.env.VITE_DB_PORT);
        console.log("Database name:", process.env.VITE_DB_NAME);
        console.log("Database user:", process.env.VITE_DB_USER);
        client.release();
    }
    catch (error) {
        console.error("Error connecting to PostgreSQL Database:", error);
    }
}

verifyConnection();

app.get("/api", async(_req, res) => {
    try {
        res.json({ status: "ok" });
    }
    catch (error) {
        console.log("Error executing query:", error);
        res.status(500).json({ error: "Database error!" });
    }
})

app.get("/api/test", async(_req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "TEST"');
        res.json(result.rows);
    }
    catch (error) {
        console.log("Error executing query:", error);
        res.status(500).json({ error: "Database error!" });
    }
})

app.listen(3000, () => { console.log("API on http://localhost:3000") });

// run this command in the terminal:
// npx tsx index.ts