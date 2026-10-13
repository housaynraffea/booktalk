import { useMemo, useState } from 'react';
import './search-field.css';

const SearchField = () => {
    const something = "";
    const [error, setError] = useState<string | null>(null);
    const [searchItem, setSearchItem] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchItem(e.target.value);
    }

    const searchedItems = useMemo(() => {
        const searchTerm = searchItem.trim().toLowerCase();
        if (!searchTerm) return something;

        // usernames
        if (searchTerm.startsWith('@')) {
            const username = searchTerm.slice(1);
            if (!username) return something;
            
            //return something.filter(q => q.userName?.toLowerCase().includes(username));
        }

        // something
        //return something.filter(q => q.quizTitle.toLowerCase().includes(searchTerm));
    }, [something, searchItem]);

  return (
    <div>
        <input className="search-input"
                    type="text"
                    value={searchItem}
                    onChange={handleInputChange}
                    placeholder="Search for books, or add '@' at the beginning to search for users"
                />
    </div>
  );
};

export default SearchField;