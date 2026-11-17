#!/usr/bin/env python3
import gzip, json, sys, psycopg

# load the **DOWNLOADED** OpenLibrary monthly dump into an unlogged PostgreSQL table
DATABASE_URL = "DATABASE_URL_HERE"

def build_copy_command(table_name):
    return (
        f"COPY {table_name} (key, data) FROM STDIN "
        r"WITH (FORMAT csv, DELIMITER E'\t', QUOTE E'\b')"
    )


def cleanup(json_text):
    return json_text.replace("\\u0000", "")

# i have yet to see work data which has no covers,
# but this should be enough (hopefully)
def has_valid_cover(work_data):
    for cover_id in work_data.get("covers", []):
        if isinstance(cover_id, int) and cover_id > 0:
            return True
    return False


def get_author_keys(work_data):
    author_keys = []
    for author_entry in work_data.get("authors", []):
        if not isinstance(author_entry, dict):
            continue
        author_info = author_entry.get("author")
        if isinstance(author_info, dict) and author_info.get("key"):
            author_keys.append(author_info["key"])
    return author_keys


def load_works(works_file_path, max_books):
    needed_author_keys = set()
    books_saved = 0
    lines_read = 0

    with psycopg.connect(DATABASE_URL) as connection, connection.cursor() as cursor:
        with cursor.copy(build_copy_command("raw_works_data")) as database_writer, gzip.open(works_file_path, "rt", encoding="utf-8") as works_file:
            for line in works_file:
                lines_read += 1

                columns = line.rstrip("\n").split("\t")
                if len(columns) < 5:
                    continue

                key = columns[1]
                json_text = columns[4]

                try:
                    work_data = json.loads(json_text)
                except ValueError:
                    continue

                if not work_data.get("title"):
                    continue
                if not has_valid_cover(work_data):
                    continue
                author_keys = get_author_keys(work_data)
                if not author_keys:
                    continue

                needed_author_keys.update(author_keys)
                database_writer.write(f"{key}\t{cleanup(json_text)}\n")
                books_saved += 1

                if books_saved % 50000 == 0:
                    print(f"Saved {books_saved:,} books (read {lines_read:,} lines)", flush=True)

                if books_saved >= max_books:
                    break

        connection.commit()

    print(f"Works done: saved {books_saved:,}, read {lines_read:,} lines, "
          f"{len(needed_author_keys):,} authors needed")
    return needed_author_keys


def load_authors(authors_file_path, needed_author_keys):
    authors_saved = 0

    with psycopg.connect(DATABASE_URL) as connection, connection.cursor() as cursor:
        with cursor.copy(build_copy_command("raw_authors_data")) as database_writer, \
             gzip.open(authors_file_path, "rt", encoding="utf-8") as authors_file:

            for line in authors_file:
                columns = line.rstrip("\n").split("\t")
                if len(columns) < 5:
                    continue

                key = columns[1]
                json_text = columns[4]

                if key not in needed_author_keys:
                    continue

                database_writer.write(f"{key}\t{cleanup(json_text)}\n")
                authors_saved += 1

        connection.commit()

    print(f"Authors done: saved {authors_saved:,}")


if __name__ == "__main__":
    works_file_path = sys.argv[1]
    authors_file_path = sys.argv[2]
    max_books = int(sys.argv[3]) if len(sys.argv) > 3 else 100000

    needed_author_keys = load_works(works_file_path, max_books)
    load_authors(authors_file_path, needed_author_keys)