CREATE TABLE IF NOT EXISTS public."ACCOUNT" (
    account_id serial PRIMARY KEY,
	email varchar(254) NOT NULL,
    display_name varchar(64) NOT NULL,
	username varchar(32) UNIQUE NOT NULL,
    password_hash text NOT NULL,
    bio text,
	favourite_book_key text REFERENCES public."BOOK" (key) ON DELETE SET NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS account_unique_username ON public."ACCOUNT"(LOWER(username));
CREATE UNIQUE INDEX IF NOT EXISTS account_unique_email ON public."ACCOUNT"(LOWER(email));

CREATE TABLE IF NOT EXISTS public."ACCOUNT_PROFILE_PICTURE" (
	account_id integer PRIMARY KEY REFERENCES public."ACCOUNT" (account_id) ON DELETE CASCADE,
	image bytea NOT NULL,
	content_type text NOT NULL DEFAULT 'image/webp'
);

CREATE TABLE IF NOT EXISTS public."REVIEW" (
    review_id serial PRIMARY KEY,
	book_key text NOT NULL REFERENCES public."BOOK" (key),
    account_id integer NOT NULL REFERENCES public."ACCOUNT" (account_id) ON DELETE CASCADE,
    stars real NOT NULL,
    description text,
    created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT per_book UNIQUE (account_id, book_key),
	CONSTRAINT stars_step CHECK (stars BETWEEN 1 AND 5 AND stars * 2 = round(stars * 2))
);

CREATE TABLE IF NOT EXISTS public."COMMENT" (
    comment_id serial PRIMARY KEY,
    account_id integer NOT NULL REFERENCES public."ACCOUNT" (account_id) ON DELETE CASCADE,
    review_id integer NOT NULL REFERENCES public."REVIEW" (review_id) ON DELETE CASCADE,
    comment text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comment_review_id_index ON public."COMMENT" (review_id, created_at);
CREATE INDEX IF NOT EXISTS comment_account_id_index ON public."COMMENT" (account_id);

-- DANGER ZONE! (Uncomment and execute in this order if you want to run these)
--DROP TABLE "COMMENT";
--DROP TABLE "REVIEW";
--DROP TABLE "ACCOUNT_PROFILE_PICTURE";
--DROP TABLE "ACCOUNT"