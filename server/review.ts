import { Router } from "express";
import { Pool } from "pg";
import { requireLogin } from "./auth";

export function createReviewRouter(pool: Pool): Router {
    const router = Router();
    
    // ONE review (for the Review page)
    router.get("/:review_id", async (request, response) => {
        const review_id = Number(request.params.review_id);

        if (!Number.isInteger(review_id)) {
            response.status(400).json({ error: "Invalid Review Id!" });
            return;
        }

        try {
            const result = await pool.query(
                `SELECT r.review_id, r.book_key, r.stars, 
                        r.description, r.created_at, r.updated_at,
                        a.account_id, a.username, a.display_name,
                        b.title, b.authors, b.cover
                FROM "REVIEW" r 
                JOIN "ACCOUNT" a ON a.account_id = r.account_id
                JOIN "BOOK" b on b.key = r.book_key
                WHERE r.review_id = $1`,
                [review_id]
            );

            if (result.rows.length === 0) {
                response.status(404).json({ error: "Review not found!" });
                return;
            }

            response.json(result.rows[0]);
        }
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Could not load review!" });
        }
    });

    router.delete("/:review_id", requireLogin, async (request, response) => {
        const review_id = Number(request.params.review_id);

        if (!Number.isInteger(review_id)) {
            response.status(400).json({ error: "Invalid Review Id!" });
            return;
        }

        try {
            const result = await pool.query(
                `DELETE FROM "REVIEW" WHERE review_id = $1 AND account_id = $2 RETURNING review_id`,
                [review_id, request.session.account_id]
            );

            if (result.rowCount === 0) {
                response.status(404).json({ error: "Review not found!" });
                return;
            }

            response.json({ ok: true });
        }
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Could not delete review!" });
        }
    });

    router.get("/:review_id/comments", async (request, response) => {
        const review_id = Number(request.params.review_id);

        if (!Number.isInteger(review_id)) {
            response.status(400).json({ error: "Invalid Review Id!" });
            return;
        }

        try {
            const result = await pool.query(
                `SELECT c.comment_id, c.comment, c.created_at, 
                        a.account_id, a.username, a.display_name
                FROM "COMMENT" c
                JOIN "ACCOUNT" a ON a.account_id = c.account_id
                WHERE c.review_id = $1
                ORDER BY c.created_at
                LIMIT 100`,
                [review_id]
            );
            response.json({ comments: result.rows });
        }
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Could not load comments!" });
        }
    });

    router.post("/:review_id/comments", requireLogin, async (request, response) => {
        const review_id = Number(request.params.review_id);
        const comment = String(request.body?.comment ?? "").replace(/\r\n/g, "\n").trim();

        if (!Number.isInteger(review_id)) {
            response.status(400).json({ error: "Invalid Review Id!" });
            return;
        }

        if (comment.length < 1 || comment.length > 1000) {
            response.status(400).json({ error: "Comment must be between 1-1000 characters!" });
            return;
        }

        try {
            const result = await pool.query(
                `INSERT INTO "COMMENT" (account_id, review_id, comment)
                VALUES ($1, $2, $3)
                RETURNING comment_id, review_id, comment, created_at`,
                [request.session.account_id, review_id, comment]
            );
            response.status(201).json(result.rows[0]);
        }
        catch (error) {
            if ((error as { code?: string }).code === "23503") {
                response.status(404).json({ error: "Review does not exist!" });
                return;
            }

            console.log("Error executing query:", error);
            response.status(500).json({ error: "Could not post comment!" });
        }
    });

    router.delete("/:comment_id", requireLogin, async (request, response) => {
        const comment_id = Number(request.params.comment_id);

        if (!Number.isInteger(comment_id)) {
            response.status(400).json({ error: "Invalid Comment Id!" });
            return;
        }

        try {
            const result = await pool.query(
                `DELETE FROM "COMMENT" WHERE comment_id = $1 AND account_id = $2 RETURNING comment_id`,
                [comment_id, request.session.account_id]
            );

            if (result.rowCount === 0) {
                response.status(404).json({ error: "Comment not found!" });
                return;
            }

            response.json({ ok: true });
        }
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Could not post comment!" });
        }
    });

    return router;
}