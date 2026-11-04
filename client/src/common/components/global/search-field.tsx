import { useEffect, useRef, useState } from 'react';
import '@/common/styles/search-field.css';
import { searchBooks, coverURL, type Book } from '@/api/book';
import { useSettings } from '@/common/context/SettingsContext';
import { Link } from 'react-router-dom';
import { searchAccounts, type AccountSearchResult } from '@/api/account';

const SearchField = () => {
    // TODO: showProfilePicture
    const { showCover } = useSettings();
    const [searchItem, setSearchItem] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [accountSearchResult, setAccountSearchResult] = useState<AccountSearchResult[]>([]);
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
        const trimmedInput = searchItem.trim();
        const isAccountSearch = trimmedInput.startsWith('@');
        const query = isAccountSearch ? trimmedInput.slice(1) : trimmedInput;
        const minimumLength = isAccountSearch ? 1 : 3;

        if (query.length < minimumLength) {
            setBooks([]);
            setAccountSearchResult([]);
            setError(null);
            setIsLoading(false);
            return;
        }

        const abortController = new AbortController();

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                if (isAccountSearch) {
                    const results = await searchAccounts(query, abortController.signal);
                    setAccountSearchResult(results);
                    setBooks([]);
                }
                else {
                    const results = await searchBooks(query, abortController.signal);
                    setBooks(results);
                    setAccountSearchResult([]);
                }
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
                    {isLoading && <li className="searchResultMessage">Searching...</li>}
                    {error && <li className="searchResultMessage">{error}</li>}
                    {books.map((book) => (
                        <li className="searchResult" key={book.key}>
                            <Link to={`/book/${book.key}`} onClick={() => setIsOpen(false)}>
                                { showCover && (
                                    <img className="searchResultCover" alt="" src={coverURL(book.cover, 'S')} loading="lazy"/>
                                )}
                                <div className="searchResultText">
                                    <span className="searchResultTitle">{book.title}</span>
                                    <span className="searchResultAuthors">{book.authors}</span>
                                </div>
                            </Link>
                        </li>
                    ))}

                    {accountSearchResult.map((account) => (
                        <li className="searchResult" key={account.account_id}>
                            <Link to={`/profile/${account.account_id}`} onClick={() => setIsOpen(false)}>
                                { showCover && (
                                    <img className="searchResultCover" alt="" src="/buttons/ProfileButton.svg" loading="lazy"/>
                                )}
                                <div className="searchResultText">
                                    <span className="searchResultTitle">{account.display_name}</span>
                                    <span className="searchResultAuthors">@{account.username}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchField;