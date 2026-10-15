import Navbar from '@/common/components/navbar/navbar';
import '@/common/styles/index.css';
import '@/common/styles/home.css';
import Footer from '@/common/components/footer/footer';

const Home = () => {
  const recommendedRandomQuotes = [
    "Tailored for you!", 
    "You should read these next!", 
    "Fresh out the bakery!", 
    "New books for you!"];
  
  const popularRandomQuotes = [
    "Something's HOT on THIS calendar!", 
    "Check out what people are reading!", 
    "Lovely day for something new!", 
    "Let's Talk about these Books!"];
  
  const popularityTimeframe = [
    "This week", 
    "This month", 
    "This year"];
  
  function randomize(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  return (
    <div>
        <Navbar/>
        <div className="center welcome">
          <table>
            <tr>
              <td><img src="/booktalk-icon.svg" width="200px"/></td>
              <td className="welcome-spacer"/>
              <td>
                <h1>Welcome to BookTalk!</h1>
                <p>A fantastic place for book enthusiasts!</p>
              </td>
            </tr>
          </table>
        </div>

        <div className="center">
          <div className="recommended-panel">
            <table className="center">
              <tr>
                <td><p>{recommendedRandomQuotes[randomize(0, recommendedRandomQuotes.length - 1)]}</p></td>
                <td><h3>Recommended</h3></td>
              </tr>
              <tr className="panel-row-between"/>
              <tr>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
              </tr>
            </table>
          </div>

          <div className="popular-panel">
            
            <table className="center">
              <tr>
                <td>
                  <div>
                    <p>{popularRandomQuotes[randomize(0, popularRandomQuotes.length - 1)]}</p>
                  </div>
                </td>
                <td><h3>Popular</h3></td>
                <td>
                  <select>
                  <option>{popularityTimeframe[0]}</option>
                  <option>{popularityTimeframe[1]}</option>
                  <option>{popularityTimeframe[2]}</option>
                  </select>
                </td>
              </tr>
              <tr className="panel-row-between"/>
              <tr>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
                <td><img src="/book-example.png" width="200px"/></td>
              </tr>
            </table>
          </div>
        </div>
        <br/>
        <Footer/>
    </div>
  );
};

export default Home;