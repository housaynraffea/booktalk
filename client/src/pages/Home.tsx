import Navbar from '@/common/components/global/navbar';
import '@/common/styles/index.css';
import '@/common/styles/home.css';
import Footer from '@/common/components/global/footer';
import { useSettings } from '@/common/context/SettingsContext';
import { useState } from 'react';

const Home = () => {
  const randomize = <T,>(array: T[]) => array[Math.floor(Math.random() * array.length)];
  const { showRecommended, showPopular } = useSettings();
  const recommendedRandomQuotes = [
    "Tailored for you!", 
    "You should read these next!", 
    "Fresh out the bakery!",
    "New books for you!"
  ];
  
  const popularRandomQuotes = [
    "Popular!",
    "Everybody is reading!",
    "Talk about these Books!",
    "Extry! Extry!"
  ];

  const [recommendedQuote] = useState(() => randomize(recommendedRandomQuotes));
  const [popularQuote] = useState(() => randomize(popularRandomQuotes));

  const popularityTimeframe = [
    "This week", 
    "This month", 
    "This year"
  ];

  const bookWidth = "287px";
  
  
  return (
    <div>
      <Navbar/>
      <div className="welcome">
        <div className="welcomeFavicon">
          <img src="/booktalk-icon.svg" width="200px"/>
        </div>
        <div className="welcomeText">
          <h1>Welcome to BookTalk!</h1>
          <p>A fantastic place for book enthusiasts!</p>
        </div>
      </div>

      {showRecommended}
      
      <div className="bookSuggestionPanels">
        {showRecommended && (
          <div id="recommended-color" className="bookSuggestionPanel">
            <div className="bookSuggestionPanelHeader">
              <div id="popular-color" className="recommendedRandomQuote"><p>{recommendedQuote}</p></div>
              <h3>Recommended</h3>
            </div>
            <div className="bookSuggestionPanelBody">
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
            </div>
          </div>
        )}

        {showPopular && (
          <div id="popular-color" className="bookSuggestionPanel">
            <div className="bookSuggestionPanelHeader">
              <div id="recommended-color" className="popularRandomQuote"><p>{popularQuote}</p></div>
              <h3>Popular</h3>
              <select className="popularityTimeFrameSelector">
                <option>{popularityTimeframe[0]}</option>
                <option>{popularityTimeframe[1]}</option>
                <option>{popularityTimeframe[2]}</option>
              </select>
            </div>
            <div className="bookSuggestionPanelBody">
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
              <div><img src="/cover-placeholder.svg" width={bookWidth}/></div>
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