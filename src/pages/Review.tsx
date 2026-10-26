import Footer from '@/common/components/global/footer';
import Navbar from '@/common/components/global/navbar';
import '@/common/styles/index.css';
import '@/common/styles/review.css';
import { Link } from 'react-router-dom';

const Review = () => {
  return (
    <div>
      <Navbar/>
      <div className="review">
        <div className="reviewContainer">
          <div className="reviewBookCover">
            <p><img src="/book-example.png" width="300px"/></p>
          </div>
          <div className="reviewInfo">

            <div className="reviewHeader">
              <div className="reviewHeaderProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="80px"/></p>
              </div>
              <div className="reviewHeaderInfo">
                <h3>Display name's review</h3>

                <div className="reviewStars">
                  <img src="/elements/star-1.svg" width="30px"/>
                  <img src="/elements/star-1.svg" width="30px"/>
                  <img src="/elements/star-1.svg" width="30px"/>
                  <img src="/elements/star-0.svg" width="30px"/>
                  <img src="/elements/star-0.svg" width="30px"/>
                </div>
              </div>
            </div>

            <div className="reviewBody">
              <div className="reviewDescription">
                <p>Description (this is going to be a really really long description depicting Display name's reason for voting 3/5 stars for Matt Dinniman's 'Dungeon Crawler Carl')</p>
              </div>
            </div>

            <div className="reviewFooter">
              <div className="reviewDates">
                <p>Last reviewed</p>
                <p>Last updated</p>
              </div>
              <div className="reviewLikes">
                <p>100.9k</p>
              </div>
            </div>
          </div>
        </div>

        <div className="comments">
          <div className="commentsHeader">
            <h2>Comments</h2>
            <select>
              <option>Top</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>

          <div className="commentsBody">
            
            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

            <div className="comment">
              <div className="commentProfilePicture">
                <p><img src="/buttons/ProfileButton.svg" width="50px"/></p>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <h3>Display name</h3>
                </div>
                <div className="commentDescription">
                  <p>description</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Review;