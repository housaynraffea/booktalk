import Navbar from '@/common/components/global/navbar';
import '@/common/styles/profile.css';
import '@/common/styles/index.css';
import Footer from '@/common/components/global/footer';
import ProfileBookReviewCard from '@/common/components/profile/profile-book-review-card';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { type Account, getAccountByUsername } from '@/api/account';
import { getAccountReviews, type Review } from '@/api/review';
import { coverURL } from '@/api/book';

const Profile = () => {
  const { username } = useParams();
  const [account, setAccount] = useState<Account | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    const { signal } = abortController;
    
    setIsLoading(true);
    setError(null);
    setAccount(null);
    setReviews([]);

    const loadProfile = async () => {
      try {
        const accountFound = await getAccountByUsername(username, signal);
        setAccount(accountFound);
        
        if (accountFound) {
          const reviewsFound = await getAccountReviews(accountFound.account_id, signal);
          setReviews(reviewsFound);
        }
      }
      catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setError('Could not load profile!');
      }
      finally {
        if (!signal.aborted) setIsLoading(false);
      }
    }
    
    loadProfile();
    console.log(username);

    return () => abortController.abort();
  }, [username]);

  if (isLoading || error || !account) {
    return (
      <div>
        <Navbar/>
        <div className="profile">
          <p>{isLoading ? 'Loading...' : error ?? 'Profile not found!'}</p>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
        <Navbar/>
        <div className="profile">
          <div className="profilePanel">
            <div className="profilePicture">
              <img src="/buttons/ProfileButton.svg" width="250px" height="250px"/>
            </div>
            <div className="profileInfo">
              <h1>{account.display_name}</h1>
              <h2>@{account.username}</h2>
              <p>{account.bio || 'No bio yet'}</p>
            </div>
            <div className="profileFavouriteBook">
              <div className="profileFavouriteBookHeader">
                <h4>Favourite book:</h4>
              </div>
              <div className="profileFavouriteBookContainer">
                {account.favourite_book_key ? (
                  <Link to={`/book/${account.favourite_book_key}`}>
                    <img src={coverURL(account.favourite_book_cover, 'L')} alt={ account.favourite_book_title ?? ""} width="250px"/>
                  </Link>
                ) : (
                  <p>No favourite book yet</p>
                )}
                
              </div>
            </div>
          </div>

          <div className="profileReviewsPanel">
            <div className="profileReviewsPanelHeader">
              <h3>Reviews</h3>
            </div>
            <div className="profileReviewsPanelBody">
              {reviews.length === 0 && <p>No reviews yet.</p>}
              {reviews.map((review) => (
                <div className="profileReviewCard" key={review.review_id}>
                  <ProfileBookReviewCard/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer/>
    </div>
  );
};

export default Profile;