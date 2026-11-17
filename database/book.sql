CREATE EXTENSION IF NOT EXISTS PG_TRGM; --trigram searching

CREATE TABLE IF NOT EXISTS "BOOK" (
	key TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	date_published int,
	cover bigint,
	authors text not null default '',
	search tsvector generated always as (
		to_tsvector('simple', title || ' ' || authors)
	) stored
);

CREATE INDEX book_search_index ON "BOOK" USING gin (search);
CREATE INDEX book_title_trigram_index ON "BOOK" USING gin (title gin_trgm_ops);

-- raw works & authors (covers not needed)
CREATE UNLOGGED TABLE RAW_WORKS_DATA (key text, data jsonb);
CREATE UNLOGGED TABLE RAW_AUTHORS_DATA (key text, data jsonb);

-- run the python file, then call book_add_raw_data(). after you're done, delete these tables:
--DROP TABLE IF EXISTS RAW_WORKS_DATA;
--DROP TABLE IF EXISTS RAW_AUTHORS_DATA;

-- author lookup
CREATE TEMP TABLE AUTHOR_LOOKUP AS
SELECT KEY, DATA->>'name' AS NAME
FROM RAW_AUTHORS_DATA
WHERE DATA->>'name' IS NOT NULL;

CREATE UNIQUE INDEX ON AUTHOR_LOOKUP (KEY);

SELECT * FROM AUTHOR_LOOKUP;
SELECT COUNT(*) FROM RAW_AUTHORS_DATA;

-- add raw data to the book table
CREATE OR REPLACE PROCEDURE book_add_raw_data()
LANGUAGE plpgsql
AS $$
BEGIN
INSERT INTO "BOOK" (key, title, description, date_published, cover, authors)
SELECT
	split_part(raw_works.key, '/', 3),
	raw_works.data->>'title',
	COALESCE(
		raw_works.data->'description'->>'value', raw_works.data->>'description'),
		NULLIF(SUBSTRING(raw_works.data->>'first_publish_date' FROM '\d{4}'), '')::int, (
			SELECT c::bigint
			FROM jsonb_array_elements_text(COALESCE(raw_works.data->'covers','[]'::jsonb)) c
			WHERE c::bigint > 0 LIMIT 1
		),
		COALESCE((
			SELECT string_agg(al.name, ',')
			FROM jsonb_array_elements(COALESCE(raw_works.data->'authors','[]'::jsonb)) a
			JOIN AUTHOR_LOOKUP al ON al.key = a->'author'->>'key'
		),
	'')
FROM RAW_WORKS_DATA raw_works
WHERE raw_works.data->>'title' is not null
ON conflict (key) DO UPDATE
	SET title = excluded.title,
		description = excluded.description,
		date_published = excluded.date_published,
		cover = excluded.cover,
		authors = excluded.authors;
END;
$$;

CALL book_add_raw_data();
