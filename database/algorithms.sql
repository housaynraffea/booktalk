--TODO: Still working on this

-- REVIEW SCORE RULE:
	-- (applies to all algorithms)
	-- 1. by default, show books with a review score higher than 3.5 stars
	-- 2. if no books have a review score higher than 3.5 stars, show the most commonly reviewed books

-- **POPULAR** algorithm
	-- 1. fetch the top 5 books which have been reviewed
	-- 2. sort by time frame (week, month, year)

-- **RECOMMENDED** algorithm
	-- 1. get the books user A has reviewed, and get other users who have also reviewed the same book
	-- 2. fetch the top 5 books those users have reviewed in common (excluding user A)

-- "top 5": 5 books with the highest star ratings (or above 3.5 stars)