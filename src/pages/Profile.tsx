import Navbar from '@/common/components/navbar/navbar';
import '@/common/styles/profile.css';
import '@/common/styles/index.css';
import Footer from '@/common/components/footer/footer';
import ProfileBookReview from '@/common/components/profile/profile-book-review';

const Profile = () => {
  return (
    <div>
        <Navbar/>
        <div className="profile-panel">
          <table>
            <tr>
              <td>
                <div>
                  <img src="/buttons/ProfileButton.svg" width="250px" height="250px"/>
                </div>
              </td>
              <td className="profile-panel-spacer-left"/>
              <td>
                  <div className="profile-panel-accountinfo">
                    <div><h1>Display name</h1></div>
                    <div><h2>@username</h2></div>
                    <div><p>bio</p></div>
                  </div>
              </td>
              <td className="profile-panel-spacer-right"/>
              <td>
                <div className="profile-favourite-book-panel">
                  <h4>Favourite book:</h4>
                  <img src="/book-example.png" width="175px"/>
                </div>
              </td>

            </tr>
          </table>
        </div>

        <div className="profile-reviews-panel">
            <table className="center">
              <tr>
                <td><h3>Reviews</h3></td>
              </tr>
              <tr className="panel-row-between"/>
              <tr>
                <td><ProfileBookReview/></td>
                <td><ProfileBookReview/></td>
                <td><ProfileBookReview/></td>
              </tr>
            </table>
        </div>
        <br/>
        <Footer/>
    </div>
  );
};

export default Profile;