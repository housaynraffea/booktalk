import { useEffect, useRef, useState } from "react";
import { searchBooks, coverURL, type Book } from "@/api/book";
import '@/common/styles/favourite-book-picker.css'

export type FavouriteBook = {
    key: string;
    title: string;
    cover: number | null;
} | null;

type FavouriteBookPickerProps = {
    value: FavouriteBook;
    onChange: (book: FavouriteBook) => void;
}

const FavouriteBookPicker = ({ value, onChange }: FavouriteBookPickerProps) => {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState<Book[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const query = searchText.trim();

        if (query.length < 3) {
            setResults([]);
            return;
        }

        const abortController = new AbortController();

        const timer = setTimeout(async () => {
            try {
                setResults(await searchBooks(query, abortController.signal));
            }
            catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') return;
                setResults([]); 
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            abortController.abort();
        };

    }, [searchText]);

    const pickBook = (book: Book) => {
        onChange({ key: book.key, title: book.title, cover: book.cover});
        setSearchText('');
        setResults([]);
        setIsOpen(false);
    }

    return (
        <div className="bookPicker" ref={containerRef}>
            {value ? (
                <div className="bookPickerCurrent">
                    <img src={coverURL(value.cover, 'M')} alt="" width="200px"/>
                    
                    
                </div>
            ) : (
                <p>No favourite book selected</p>
            )}
            
            <button type="button" onClick={() => onChange(null)}>Remove</button>
            
            <input
                className="settingsField"
                type="text"
                value={searchText}
                placeholder="Search for your favourite book..."
                onChange={(e) => {
                    setSearchText(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
            />


            {isOpen && results.length > 0 && (
                <ul className="bookPickerResults">
                    {results.map((book) => (
                        <li key={book.key}>
                            <button type="button" className="bookPickerResult" onClick={() => pickBook(book)}>
                                <img src={coverURL(book.cover, 'S')} alt="" loading="lazy"/>
                                <div className="bookPickerInfo">
                                    <span className="bookPickerInfoTitle">{book.title}</span>
                                    <span className="bookPickerInfoAuthors">{book.authors}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavouriteBookPicker;