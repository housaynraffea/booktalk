import { useEffect, useRef, useState } from 'react';
import '@/common/styles/search-field.css';
import { searchBooks, coverURL, type BookSearchResult } from '@/api/book';

const SearchField = () => {
    const [searchItem, setSearchItem] = useState('');
    const [books, setBooks] = useState<BookSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchItem(e.target.value);
        setIsOpen(true);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    })

    useEffect(() => {
        const searchTerm = searchItem.trim();

        if (searchTerm.length < 3 || searchTerm.startsWith('@')) {
            setBooks([]);
            setError(null);
            setIsLoading(false);
            return;
        }

        const abortController = new AbortController();

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const results = await searchBooks(searchTerm, abortController.signal);
                setBooks(results);
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') return;
                setError('Could not load search results');
            } finally {
                if (!abortController.signal.aborted) setIsLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            abortController.abort();
        };
    }, [searchItem]);

    const showDropdown = isOpen && (isLoading || error !== null || books.length > 0);

    return (
        <div className="searchField" ref={containerRef}>
            <input className="searchInput"
                type="text"
                value={searchItem}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search for books, or add '@' at the beginning to search for users"
            />
            {showDropdown && (
                <ul className="searchResults">
                    {isLoading && <p className="searchResultMessage">Searching...</p>}
                    {error && <p className="searchResultMessage">{error}</p>}
                    {books.map((book) => (
                        <li className="searchResult" key={book.key}>
                            <img className="searchResultCover" src={coverURL(book.cover, 'S')} loading="lazy"/>
                            <div className="searchResultText">
                                <span className="searchResultTitle">{book.title}</span>
                                <span className="searchResultAuthors">{book.authors}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchField;