# Database

The following files in this folder are BookTalk's CREATE scripts. Run `book.sql` first, then `account_review_comment.sql`.

To start, you should;

1. Download the monthly dumps available in OpenLibrary's website ('authors' and 'works' dumps).

2. Create temporary, unlogged tables `RAW_WORKS_DATA` and `RAW_AUTHORS_DATA` in PostgreSQL for the `load_dumps.py` script to work (it also needs a connection string but you could probably figure that out).

3. Create the "BOOK" table with its indexes and author lookups (look in `book.sql`), then run the `book_add_raw_data()` procedure. This uses the raw data from the unlogged tables to turn them into proper rows for the "BOOK" table.

4. After you're done, you can run `DROP TABLE RAW_WORKS_DATA` and `DROP TABLE RAW_AUTHORS_DATA` to delete the unlogged tables.

## **IMPORTANT! READ BEFORE DOING THE STEPS ABOVE!**

**BEFORE RUNNING `load_dumps.py` YOU SHOULD KNOW that it takes A LOT OF SPACE to load data from the monthly dumps.** The script loads the amount of books that you want to pass in as the third argument (the first two are the file paths for the works and authors dumps). The script (by default) loads in 100000 rows of data if no third argument is given. I have not yet calculated how much gigabytes this is, but it should at the very least be enough...
