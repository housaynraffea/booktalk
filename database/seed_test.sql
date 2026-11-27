-- =====================================================================
-- SEED DATA for testing the POPULAR and RECOMMENDED algorithms
--
-- Creates 10 users (seed_user1 ... seed_user10) with reviews and comments
-- on a small pool of 30 existing books from "BOOK", so users overlap.
--
-- Login: seed_userN@seed.test / testpassword123  (N = 1..10)
-- Safe to re-run: old seed users (and their reviews/comments, via
-- ON DELETE CASCADE) are deleted first.
--
-- TASTE GROUPS (so recommendations have something real to find):
--   Users 1-4  ("group A"): rate the FIRST half of the pool high (4-5),
--                           the second half low (1.5-3)
--   Users 5-8  ("group B"): the opposite
--   Users 9-10 ("neutral"): random ratings 1-5
-- Expected: user 1 should be recommended unreviewed books from the first
-- half of the pool (liked by users 2-4), NOT books from the second half.
--
-- Review dates are skewed towards recent (but spread over 400 days), so
-- the week / month / year filters for POPULAR give different results.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- for crypt()/gen_salt() (bcrypt)

BEGIN;

SELECT setseed(0.42);  -- same "random" data every run (same session)

-- ---------- clean up old seed data ----------
--DELETE FROM public."ACCOUNT" WHERE email LIKE '%@seed.test';
-- ---------- users ----------
-- bcrypt cost 12, $2a$ prefix: compatible with bcryptjs in auth.ts
WITH pw AS (
    SELECT crypt('testpassword123', gen_salt('bf', 12)) AS hash
)
INSERT INTO public."ACCOUNT" (email, display_name, username, password_hash, bio, created_at)
SELECT 'seed_user' || n || '@seed.test',
       (ARRAY['Alice Reader','Bob Bookworm','Cleo Pages','Dan Novel','Eva Shelf',
              'Finn Fable','Gina Plot','Hugo Verse','Iris Chapter','Jonas Spine'])[n],
       'seed_user' || n,
       pw.hash,
       'Seed account number ' || n || '.',
       now() - interval '450 days'
FROM generate_series(1, 10) AS n, pw;

CREATE TEMP TABLE seed_users ON COMMIT DROP AS
SELECT account_id, substring(username FROM 10)::int AS n
FROM public."ACCOUNT"
WHERE email LIKE '%@seed.test';

-- ---------- book pool (30 deterministic books) ----------
CREATE TEMP TABLE seed_books ON COMMIT DROP AS
SELECT key, row_number() OVER (ORDER BY md5(key))::int AS n
FROM (SELECT key FROM public."BOOK" ORDER BY md5(key) LIMIT 30) AS pool;

-- ---------- reviews (each user reviews ~40% of the pool) ----------
WITH picks AS MATERIALIZED (
    SELECT b.key AS book_key,
           u.account_id,
           CASE
               WHEN (u.n <= 4 AND b.n <= h.half)
                 OR (u.n BETWEEN 5 AND 8 AND b.n > h.half) THEN 4 + random()   -- liked
               WHEN u.n <= 8 THEN 1.5 + random() * 1.5                         -- disliked
               ELSE 1 + random() * 4                                           -- neutral
           END AS raw_stars,
           random() AS has_desc,
           random() AS desc_pick,
           random() AS age,
           random() AS edited
    FROM seed_users u
    CROSS JOIN seed_books b
    CROSS JOIN (SELECT count(*) / 2 AS half FROM seed_books) h
    WHERE random() < 0.4
)
INSERT INTO public."REVIEW" (book_key, account_id, stars, description, created_at, updated_at)
SELECT p.book_key,
       p.account_id,
       x.stars,
       CASE WHEN p.has_desc < 0.6 THEN
           CASE
               WHEN x.stars >= 4 THEN (ARRAY[
                   'Absolutely loved this one, could not put it down.',
                   'Great characters and a fantastic ending.',
                   'One of my favourites this year. Highly recommend!',
                   'Beautifully written, I will read it again.',
                   'Gripping from the first page.'])[1 + floor(p.desc_pick * 5)::int]
               WHEN x.stars < 3 THEN (ARRAY[
                   'Struggled to finish this, the pacing dragged.',
                   'Not for me. The characters felt flat.',
                   'Had high hopes but it did not deliver.',
                   'Too long and too predictable.',
                   'Interesting idea, poor execution.'])[1 + floor(p.desc_pick * 5)::int]
               ELSE (ARRAY[
                   'Decent read, some parts better than others.',
                   'Solid but not memorable.',
                   'Enjoyed the first half more than the second.',
                   'Good for a rainy weekend.',
                   'Worth a try if you like the genre.'])[1 + floor(p.desc_pick * 5)::int]
           END
       END,
       x.created_at,
       CASE WHEN p.edited < 0.2
            THEN x.created_at + (now() - x.created_at) * 0.5
            ELSE x.created_at END
FROM picks p
CROSS JOIN LATERAL (
    SELECT GREATEST(1, LEAST(5, round(p.raw_stars * 2) / 2))::real AS stars,   -- 0.5 steps
           now() - (p.age ^ 2) * interval '400 days'                AS created_at
) x;

-- ---------- comments (~15% of other users comment on each review) ----------
INSERT INTO public."COMMENT" (account_id, review_id, comment, created_at)
SELECT u.account_id,
       r.review_id,
       (ARRAY[
           'Totally agree with this!',
           'Interesting take, I felt differently.',
           'Great review, adding this to my list.',
           'I could not get through this one either.',
           'Did you read the sequel?',
           'Thanks for the honest review.',
           'Hard disagree, but well written!',
           'This convinced me to give it a try.'])[1 + floor(random() * 8)::int],
       r.created_at + (now() - r.created_at) * random()
FROM public."REVIEW" r
JOIN seed_users author ON author.account_id = r.account_id
JOIN seed_users u      ON u.account_id <> r.account_id
WHERE random() < 0.15;

COMMIT;

-- Reviews per time window (for week / month / year)
--SELECT count(*) FILTER (WHERE created_at >= now() - interval '7 days')   AS last_week,
--       count(*) FILTER (WHERE created_at >= now() - interval '30 days')  AS last_month,
--       count(*) FILTER (WHERE created_at >= now() - interval '365 days') AS last_year
--FROM public."REVIEW";
