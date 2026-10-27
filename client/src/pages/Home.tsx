import Navbar from '@/common/components/global/navbar';
import '@/common/styles/index.css';
import '@/common/styles/home.css';
import Footer from '@/common/components/global/footer';

const Home = () => {
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
  
  const popularityTimeframe = [
    "This week", 
    "This month", 
    "This year"
  ];
  
  function randomize(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
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

        <div className="bookSuggestionPanels">
          <div id="recommended-color" className="bookSuggestionPanel">
            <div className="bookSuggestionPanelHeader">
              <div id="popular-color" className="recommendedRandomQuote"><p>{recommendedRandomQuotes[randomize(0, recommendedRandomQuotes.length - 1)]}</p></div>
              <h3>Recommended</h3>
            </div>
            <div className="bookSuggestionPanelBody">
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
            </div>
          </div>

          <div id="popular-color" className="bookSuggestionPanel">
            <div className="bookSuggestionPanelHeader">
              <div id="recommended-color" className="popularRandomQuote"><p>{popularRandomQuotes[randomize(0, recommendedRandomQuotes.length - 1)]}</p></div>
              <h3>Popular</h3>
              <select className="popularityTimeFrameSelector">
                <option>{popularityTimeframe[0]}</option>
                <option>{popularityTimeframe[1]}</option>
                <option>{popularityTimeframe[2]}</option>
              </select>
            </div>
            <div className="bookSuggestionPanelBody">
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
              <div><img src="/book-example.png" width="200px"/></div>
            </div>
          </div>
        </div>
        <br/>
        <Footer/>
    </div>
  );
};

export default Home;