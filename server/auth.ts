import { Router, type NextFunction, type Request, type Response} from "express";
import type { Pool } from "pg";
import "express-session";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

declare module "express-session" {
    interface SessionData {
        account_id: number;
    }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,32}$/;
const PASSWORD_MIN = 12;
const PASSWORD_MAX = 128;

const TEST_HASH = bcrypt.hashSync("test-hash", 12);

const rateLimiter = rateLimit({
    windowMs: 15*60*1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts! Please try again in a few minutes." }
});

function startSession(request: Request, account_id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        request.session.regenerate((regenerateError) => {
            if (regenerateError) return reject(regenerateError);
            request.session.account_id = account_id;
            request.session.save((saveError) => (saveError ? reject(saveError) : resolve()));
        });
    });
}

export function requireLogin(request: Request, response: Response, next: NextFunction) {
    if (!request.session.account_id) {
        response.status(401).json({ error: "You need to log in!" });
        return;
    }

    next();
}

export function createAuthRouter(pool: Pool): Router {
    const router = Router();

    router.post("/register", rateLimiter, async (request, response) => {
        const email = String(request.body?.email ?? "").trim().toLowerCase();
        const username = String(request.body?.username ?? "").trim();
        const display_name = String(request.body?.display_name ?? "").trim();
        const password = String(request.body?.password ?? "");
        
        if (!EMAIL_PATTERN.test(email) || email.length > 254) {
            response.status(400).json({ error: "Enter a valid email address!" });
            return;
        }

        if (!USERNAME_PATTERN.test(username)) {
            response.status(400).json({ error: "Username can only contain letters, numbers and underscores, and must only be between 3-32 characters!" });
            return;
        }

        if (display_name.length < 3 || display_name.length > 64) {
            response.status(400).json({ error: "Display name must be between 3-64 characters!" });
            return;
        }

        if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
            response.status(400).json({ error: `Password must be between ${PASSWORD_MIN}-${PASSWORD_MAX} characters! (Don't make this too simple to guess!)` });
            return;
        }

        try {
            const password_hash = await bcrypt.hash(password, 12);
            const result = await pool.query(
                `INSERT INTO "ACCOUNT" (email, display_name, username, password_hash)
                VALUES ($1, $2, $3, $4)
                RETURNING account_id, username, display_name`,
                [email, display_name, username, password_hash]
            );
            const user = result.rows[0];
            await startSession(request, user.account_id);
            response.status(201).json({ user });
        }
        catch (error) {
            const database_error = error as { code?: string, constraint?: string };
            if (database_error.code === "23505") {
                response.status(409).json({ error: "Could not create account!" });
            }

            console.log("Register Error! Error:", error);
            response.status(500).json({ error: "Could not create account!" });
        }
    });

    router.post("/login", rateLimiter, async (request, response) => {
        const email = String(request.body?.email ?? "").trim().toLowerCase();
        const password = String(request.body?.password ?? "");

        try {
            const result = await pool.query(
                `SELECT account_id, username, display_name, password_hash
                FROM "ACCOUNT" WHERE lower(email) = $1`,
                [email]
            );
            const account = result.rows[0];

            const password_matches = await bcrypt.compare(
                password,
                account ? account.password_hash : TEST_HASH
            );

            if (!account || !password_matches) {
                response.status(401).json({ error: "Invalid email or password!" });
                return;
            }

            await startSession(request, account.account_id);
            response.json({
                user: {
                    account_id: account.account_id,
                    username: account.username,
                    display_name: account.display_name,
                },
            });
        }
        catch (error) {
            console.log("Login error! Error:", error);
            response.status(500).json({ error: "Could not log in!" });
        }
    });

    router.post("/logout", (request, response) => {
        request.session.destroy((error) => {
            if (error) {
                response.status(500).json({ error: "Could not log out!" });
                return;
            }

            response.clearCookie("connect.sid");
            response.json({ ok: true });
        });
    });

    router.get("/me", async (request, response) => {
        const account_id = request.session.account_id;
        if(!account_id) {
            response.json({ user: null });
            return;
        }

        try {
            const result = await pool.query(`
                SELECT account_id, username, display_name FROM "ACCOUNT" WHERE account_id = $1`,
                [account_id]
            );

            response.json({ user: result.rows[0] ?? null });
        }
        catch (error) {
            console.log("Me error! Error:", error);
            response.status(500).json({ error: "Could not load user!" });
        }
    });

    return router;
}