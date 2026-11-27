import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Stars from '@/common/components/review/stars';
import { getBookReviews, saveReview, type Review } from '@/api/review';
import '@/common/styles/book.css'
import ProfilePicture from '@/common/components/global/profile-picture';

type Props = {
  book_key: string;
  logged_in: boolean;
}

const BookReviews = ({book_key, logged_in}: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function load(signal?: AbortSignal) {
    setReviews(await getBookReviews(book_key, signal));
  }

  useEffect(() => {
    const abortController = new AbortController();
    load(abortController.signal).catch((e) => {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError('Could not load reviews!');
    });
  }, [book_key]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    
    if (stars < 1) {
      setError('You have to pick at least 1 star!');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveReview(book_key, stars, description);
      
      setStars(0);
      setDescription('');

      await load();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save review!');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bookReviews">
      {logged_in ? (
        <form onSubmit={onSubmit}>
          <Stars value={stars} onChange={setStars}/>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a review (optional)"
            maxLength={5000}
          />

          <button type="submit" disabled={isSaving}>Post Review</button>
        </form>
      ) : (
        <p>You must be logged in to review this book!</p>
      )}
      <h2>Reviews</h2>

      {error && <p>{error}</p>}

      {reviews.map((review) => (
        <div key={review.review_id} className="bookReviewItem">
          <div className="profile-picture">
            <ProfilePicture account_id={review.account_id} size={75}/>
          </div>
          <div>
            <Link to={`/review/${review.review_id}`}>
              <strong>{review.display_name}</strong>(@{review.username})
            </Link>
            <Stars value={review.stars} size={20}/>
            {review.description && <p>{review.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookReviews;