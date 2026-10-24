import Navbar from '@/common/components/global/navbar';
import '@/common/styles/profile.css';
import '@/common/styles/index.css';
import Footer from '@/common/components/global/footer';
import ProfileBookReviewCard from '@/common/components/profile/profile-book-review-card';

const Profile = () => {
  return (
    <div>
        <Navbar/>
        <div className="profile">
          <div className="profilePanel">
            <div className="profilePicture">
              <img src="/buttons/ProfileButton.svg" width="250px" height="250px"/>
            </div>
            <div className="profileInfo">
              <h1>Display name</h1>
              <h2>@username</h2>
              <p>bio</p>
            </div>
            <div className="profileFavouriteBook">
              <div className="profileFavouriteBookHeader">
                <h4>Favourite book:</h4>
              </div>
              <div className="profileFavouriteBookContainer">
                <img src="/book-example.png" width="250px"/>
              </div>
            </div>
          </div>

          <div className="profileReviewsPanel">
            <div className="profileReviewsPanelHeader">
              <h3>Reviews</h3>
            </div>
            <div className="profileReviewsPanelBody">
              <div className="profileReviewCard"><ProfileBookReviewCard/></div>
              <div className="profileReviewCard"><ProfileBookReviewCard/></div>
              <div className="profileReviewCard"><ProfileBookReviewCard/></div>
              <div className="profileReviewCard"><ProfileBookReviewCard/></div>
              <div className="profileReviewCard"><ProfileBookReviewCard/></div>
              <div className="profileReviewCard"><ProfileBookReviewCard/></div>
            </div>
          </div>
        </div>
        <Footer/>
    </div>
  );
};

export default Profile;