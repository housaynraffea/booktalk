import Navbar from '@/common/components/navbar/navbar';
import '@/common/styles/index.css';
import '@/common/styles/home.css';
import Footer from '@/common/components/footer/footer';

const Home = () => {
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
                <td><h3>Popular</h3></td>
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