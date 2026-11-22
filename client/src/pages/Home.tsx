import Navbar from '@/common/components/global/navbar';
import '@/common/styles/index.css';
import '@/common/styles/home.css';
import Footer from '@/common/components/global/footer';
import { useSettings } from '@/common/context/SettingsContext';
import { useEffect, useState } from 'react';
import { useAuth } from '@/common/context/AuthContext';
import { coverURL, getAccountRecommendedBooks, getPopularBooks, type PopularBook, type RecommendedBook } from '@/api/book';
import { Link } from 'react-router-dom';

const Home = () => {
  const randomize = <T,>(array: T[]) => array[Math.floor(Math.random() * array.length)];
  const { showRecommended, showPopular } = useSettings();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBook[]>([]);
  const [recommendedBookError, setRecommendedBookError] = useState<string | null>(null);

  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [popularBookError, setPopularBookError] = useState<string | null>(null);

  const isLoggedIn = !isAuthLoading && user !== null;
  
  const welcomeRandomQuotes = [
    "A fantastic place for book enthusiasts!", 
    "A nice website to read something new!", 
    "An awesome site for book reviews!",
    "A perfect place for book lovers!"
  ];
  
  const recommendedRandomQuotes = [
    "Tailored for you!", 
    "You should read these next!", 
    "Fresh out the library!",
    "New books for you!"
  ];
  
  const popularRandomQuotes = [
    "These books are popular!",
    "Everybody is reading!",
    "Talk about these Books!",
    "Extry! Extry!"
  ];

  const [recommendedQuote] = useState(() => randomize(recommendedRandomQuotes));
  const [popularQuote] = useState(() => randomize(popularRandomQuotes));
  const [welcomeQuote] = useState(() => randomize(welcomeRandomQuotes));

  const popularityTimeframe = [
    "This week", 
    "This month", 
    "This year"
  ];
  
  useEffect(() => {
    if (!showRecommended || !user) return;

    const abortController = new AbortController();
    setRecommendedBookError(null);

    getAccountRecommendedBooks(user.account_id, abortController.signal)
      .then(setRecommendedBooks)
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setRecommendedBookError('Could not find recommended books! (Start by reviewing a book!)');
      })

    return () => abortController.abort();
  }, [showRecommended, user?.account_id]);

  useEffect(() => {
    if (!showPopular) return;

    const abortController = new AbortController();
    setPopularBookError(null);

    getPopularBooks(abortController.signal)
      .then(setPopularBooks)
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setPopularBookError('Could not find popular books!');
      })

    return () => abortController.abort();
  }, [showRecommended]);

  return (
    <div>
      <Navbar/>
      <div className="welcome">
        <div className="welcomeFavicon">
          <img src="/booktalk-icon.svg" width="200px"/>
        </div>
        <div className="welcomeText">
          <h1>Welcome to BookTalk!</h1>
          <p>{welcomeQuote}</p>
        </div>
      </div>
      
      <div className="bookSuggestionPanels">
        {isLoggedIn && showRecommended && (
          <div className="bookSuggestionPanel recommended-color">
            <div className="bookSuggestionPanelHeader">
              <div className="recommendedRandomQuote popular-color"><p>{recommendedQuote}</p></div>
              <h3>Recommended</h3>
            {recommendedBookError && <p>{recommendedBookError}</p>}
            </div>
            <div className="bookSuggestionPanelBody">
              {recommendedBooks.map((recommended) => (
                <div key={recommended.key}>
                  <Link to={`/book/${recommended.key}`}>
                    <img src={coverURL(recommended.cover, 'L')}/>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPopular && (
          <div className="bookSuggestionPanel popular-color">
            <div className="bookSuggestionPanelHeader">
              <div className="popularRandomQuote recommended-color"><p>{popularQuote}</p></div>
              <h3>Popular</h3>
              <select className="popularityTimeFrameSelector">
                <option>{popularityTimeframe[0]}</option>
                <option>{popularityTimeframe[1]}</option>
                <option>{popularityTimeframe[2]}</option>
              </select>
            {popularBookError && <p>{popularBookError}</p>}
            </div>
            <div className="bookSuggestionPanelBody">
              {popularBooks.map((popular) => (
                <div key={popular.key}>
                  <Link to={`/book/${popular.key}`}>
                    <img src={coverURL(popular.cover, 'L')}/>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <br/>
      <Footer/>
    </div>
  );
};

export default Home;