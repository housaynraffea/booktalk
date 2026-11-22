import { Router } from "express";
import { Pool } from "pg";
import { requireLogin } from "./auth";

function parseStars (value: unknown): number | null {
    const stars = Number(value);
    if (!Number.isFinite(stars) || stars < 1 || stars > 5) return null;
    if (!Number.isInteger(stars * 2)) return null;
    return stars;
}

export function createBookRouter(pool: Pool): Router {
    const router = Router();

    router.get("/search", async(request, response) => {
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
    
    router.get("/recommended/:account_id", requireLogin, async(request, response) => {
        const account_id = Number(request.params.account_id);
    
        if (!Number.isInteger(account_id)) {
            response.status(400).json({ error: "Invalid Account Id" });
            return;
        }
    
        try {
            const result = await pool.query(
                `
                WITH me AS (
                    SELECT book_key, stars
                    FROM "REVIEW"
                    WHERE account_id = $1
                ),
                like_me AS (
                    SELECT r.account_id, COUNT(*) AS agreements FROM "REVIEW" r
                    JOIN me ON me.book_key = r.book_key
                    WHERE r.account_id <> $1 AND ABS(r.stars - me.stars) <= 1
                    GROUP BY r.account_id HAVING COUNT(*) >= 2
                ),
                candidates AS (
                    SELECT r.book_key, SUM(lm.agreements)::int as score, COUNT(*)::int AS recommendees
                    FROM "REVIEW" r
                    JOIN like_me lm ON lm.account_id = r.account_id
                    WHERE r.stars >= 4 AND r.book_key NOT IN (SELECT book_key FROM me)
                    GROUP BY r.book_key
                )
                SELECT b.key, b.title, b.cover, c.score, c.recommendees
                FROM candidates c
                JOIN public."BOOK" b ON b.key = c.book_key
                ORDER BY c.score DESC, c.recommendees DESC
                LIMIT 5;`,
                [account_id]
            );
    
            if (result.rows.length === 0) {
                response.status(404).json({ error: "Not found" });
                return;
            }
    
            response.json({ books: result.rows });
        }
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Book recommending failed" });
        }
    });
    
    router.get("/popular", async(request, response) => {
        try {
            const result = await pool.query(
                `SELECT b.key, b.title, b.cover,
                    ROUND(AVG(r.stars)::numeric, 2) AS avg_stars, COUNT(*) AS reviews
                    FROM public."REVIEW" r JOIN public."BOOK" b ON b.key = r.book_key
                GROUP BY b.key, b.title, b.cover ORDER BY reviews DESC, avg_stars DESC LIMIT 5;`
            );
    
            if (result.rows.length === 0) {
                response.status(404).json({ error: "Not found" });
                return;
            }
    
            response.json({ books: result.rows });
        }
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Popular books query failed" });
        }
    });
    
    router.get("/:key", async(request, response) => {
        try {
            const result = await pool.query(
                `SELECT key, title, authors, cover, description
                FROM "BOOK"
                WHERE key = $1`,
                [request.params.key]
            );
    
            if (result.rows.length === 0) {
                response.status(404).json({ error: "Book not found!" });
                return;
            }
            
            response.json(result.rows[0]);
        }
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Book search failed!" });
        }
    });
    
    router.get("/:key/reviews", async(request, response) => {
        try {
            const result = await pool.query(
                `SELECT r.review_id, r.stars, r.description, 
                        r.created_at, r.updated_at, a.account_id,
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
    
    // UPDATE or ADD new review
    router.post("/:key/reviews", requireLogin, async(request, response) => {
        const account_id = request.session.account_id as number;
        const stars = parseStars(request.body?.stars);
        const description = String(request.body?.description ?? "").replace(/\r\n/g, "\n").trim();
        
        if (stars === null) {
            response.status(400).json({ error: "You need to give it some stars!" });
            return;
        }
    
        if (description.length > 5000) {
            response.status(400).json({ error: "Description is too long! Must be under 5000 characters." });
            return;
        }
    
        try {
            const result = await pool.query(
                `INSERT INTO "REVIEW" (book_key, account_id, stars, description)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (account_id, book_key)
                DO UPDATE SET stars = EXCLUDED.stars, description = EXCLUDED.description, updated_at = now()
                RETURNING review_id, book_key, stars, description, created_at, updated_at`,
                [request.params.key, account_id, stars, description === "" ? null : description]
            );
            response.status(201).json(result.rows[0]);
        }
        catch (error) {
            if ((error as { code?: string }).code === "23503") {
                response.status(404).json({ error: "Book does not exist!" });
                return;
            }
    
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Could not save review!" });
        }
    });

    return router;  
}