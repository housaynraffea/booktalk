import Navbar from '@/common/components/global/navbar';
import '@/common/styles/index.css';
import '@/common/styles/book.css';
import Footer from '@/common/components/global/footer';
import { useParams, useSearchParams } from 'react-router-dom';
import { getBook, coverURL, type Book as BookData } from '@/api/book';
import { useState, useEffect } from 'react';

const Book = () => {
  const { key } = useParams();
  const [book, setBook] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;

    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);

    getBook(key, abortController.signal)
      .then(setBook)
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setError('Could not load book');
      })
      .finally(() => {
        if (!abortController.signal.aborted) setIsLoading(false);
      });
    
    return () => abortController.abort();
  }, [key]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div>
        <Navbar/>
        <div className="bookInfo">
          <div className="bookInfoCover">
            <img src={coverURL(book.cover, 'L')} alt="" width="400px"/>
          </div>
          <div className="bookInfoText">
            <h1>{book.title}</h1>
            <p>{book.authors}</p>
            {book.description && <p>{book.description}</p>}
          </div>
        </div>
        <Footer/>
    </div>
  );
};

export default Book;