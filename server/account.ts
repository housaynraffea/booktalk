import { Router } from "express";
import { Pool } from "pg";
import { requireLogin } from "./auth";
import multer from "multer";
import sharp from "sharp";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2*1024*1024, files: 1},
});

const PROFILE_PICTURE_FORMATS = ["jpeg", "png", "webp", "gif"];

export function createAccountRouter(pool: Pool): Router {
    const router = Router();

    router.get("/search", async(request, response) => {
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
    
    router.get("/username-available", async (request, response) => {
        const username = String(request.query.username ?? "").trim();
    
        if (username.length < 3 || username.length > 32 || !/^[A-Za-z0-9_]+$/.test(username)){
            response.status(400).json({ error: "Invalid username" });
            return;
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
    
    router.get("/:account_id", async(request, response) => {
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
    
    router.get("/:account_id/reviews", async(request, response) => {
        const account_id = Number(request.params.account_id);
    
        if (!Number.isInteger(account_id)) {
            response.status(400).json({ error: "Invalid Account Id" });
            return;
        }
        
        try {
            const result = await pool.query(
                `SELECT r.review_id, r.book_key, r.stars,
                        r.description, r.created_at, r.updated_at, 
                        b.title, b.authors, b.cover
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
    
    router.get("/by-username/:username", async (request, response) => {
        const username = request.params.username;
    
        if (!/^[A-Za-z0-9_]+$/.test(username)) {
            response.status(404).json({ error: "Account not found!" });
            return;
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
                return;
            }
    
            response.json(result.rows[0]);
        } 
        catch (error) {
            console.log("Error executing query:", error);
            response.status(500).json({ error: "Invalid account username" });
        }
    });
    
    router.patch("/me", requireLogin, async (request, response) => {
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
                return;
            }
    
            if (db_error.code === "23503") {
                response.status(409).json({ error: "Book does not exist!" });
                return;
            }
    
            console.log("Account update error! Error:", error);
            response.status(500).json({ error: "Could not save your changes" });
        }
    });
    
    router.put("/me/profile-picture", requireLogin, 
        (request, response, next) => {
            upload.single("image")(request, response, (error) => {
                if (error) {
                    const too_big = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
                    response.status(too_big ? 413 : 400).json({ error: too_big ? "Image must be under 2 MB!" : "Invalid upload!" });
                    return;
                }
                next();
            });
        },
    
        async (request, response) => {
            if (!request.file) {
                response.status(400).json({ error: "No image was uploaded!" });
                return;
            }
    
            try {
                const input = sharp(request.file.buffer, { limitInputPixels: 25000000 });
                const metadata = await input.metadata();
    
                if (!metadata.format || !PROFILE_PICTURE_FORMATS.includes(metadata.format)) {
                    response.status(400).json({ error: "Unacceptable file format! Must be either .jpeg, .png, .webp or .gif!" });
                    return;
                }
    
                const image = await input.rotate().resize(256, 256, { fit: "cover" }).webp({ quality: 80 }).toBuffer();
                // respect EXIF, square crop, metadata is stripped (default)
    
                await pool.query(`
                    INSERT INTO "ACCOUNT_PROFILE_PICTURE" (account_id, image, content_type)
                    VALUES ($1, $2, 'image/webp')
                    ON CONFLICT (account_id)
                    DO UPDATE SET image = EXCLUDED.image, content_type = EXCLUDED.content_type`,
                    [request.session.account_id, image]
                );
    
                response.json({ ok: true });
            } catch (error) {
                console.log("Profile picture error! Error:", error);
                response.status(400).json({ error: "Could not process image!" });
            }
        }
    );
    
    router.delete("/me/profile-picture", requireLogin, async (request, response) => {
        try {
            await pool.query(`
                DELETE FROM "ACCOUNT_PROFILE_PICTURE" WHERE account_id = $1`,
                [request.session.account_id]
            );
            response.json({ ok: true });
        } catch (error) {
            console.log("Error executing query! Error:", error);
            response.status(500).json({ error: "Could not delete image!" });
        }
    });
    
    router.get("/:account_id/profile-picture", async (request, response) => {
        const account_id = Number(request.params.account_id);
    
        if (!Number.isInteger(account_id)) {
            response.status(400).json({ error: "Invalid Account Id!" });
            return;
        }
    
        try {
            const result = await pool.query(`
                SELECT image, content_type FROM "ACCOUNT_PROFILE_PICTURE" WHERE account_id = $1`, 
                [account_id]
            );
    
            if (result.rows.length === 0) {
                response.status(404).end();
                return;
            }
    
            const { image, content_type } = result.rows[0];
            response.set("Cache-Control", "no-cache"); // always revalidate
            response.type(content_type);
            response.send(image);
        } catch (error) {
            console.log("Error executing query! Error:", error);
            response.status(500).json({ error: "Could not get profile picture!" });
        }
    });

    return router;
}