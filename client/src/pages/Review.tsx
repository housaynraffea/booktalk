import Footer from '@/common/components/global/footer';
import Navbar from '@/common/components/global/navbar';
import '@/common/styles/index.css';
import '@/common/styles/review.css';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Stars from '@/common/components/review/stars';
import { coverURL } from '@/api/book';
import { getReview, deleteReview, type Review as ReviewData } from '@/api/review';
import { getComments, addComment, deleteComment, type CommentWithAccount } from '@/api/comment';
import { useAuth } from '@/common/context/AuthContext';
import ProfilePicture from '@/common/components/global/profile-picture';

const Review = () => {
  const { review_id } = useParams();
  const id = Number(review_id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [review, setReview] = useState<ReviewData | null>(null);
  const [comments, setComments] = useState<CommentWithAccount[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!Number.isInteger(id)) {
      setError('Invalid Review Id!');
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    Promise.all([getReview(id, abortController.signal), getComments(id, abortController.signal)])
      .then(([loadReview, loadComments]) => {
        setReview(loadReview);
        setComments(loadComments);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Could not load review!');
      })
      .finally(() => {
        if (!abortController.signal.aborted) setIsLoading(false);
      });
    
    return () => abortController.abort();
  }, [id]);

  async function onComment(event: FormEvent) {
    event.preventDefault();

    try {
      await addComment(id, newComment);
      setNewComment('');
      setComments(await getComments(id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not post comment!')
    }
  }

  async function onDeleteComment(comment_id: number) {
    try {
      await deleteComment(comment_id);
      setComments((current) => current.filter((comment) => comment.comment_id !== comment_id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not delete comment!')
    }
  }

  async function onDeleteReview() {
    try {
      await deleteReview(id);
      navigate(`/book/${encodeURIComponent(review!.book_key)}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not delete review!')
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (!review) return <p>{error ?? 'Review not found'} </p>;

  const sortedComments = [...comments].sort((a, b) => {
    const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sort === 'newest' ? -diff : diff;
  })

  return (
    <div>
      <Navbar/>
      <div className="review">
        <div className="reviewContainer">
          <div className="reviewBookCover">
            <Link to={`/book/${encodeURIComponent(review.book_key)}`}>
              <img src={coverURL(review.cover, 'L')} alt={review.title} width="300px"/>
            </Link>
          </div>
          <div className="reviewInfo">
            <div className="reviewHeader">
              <div className="reviewHeaderProfilePicture">
                <ProfilePicture account_id={review.account_id} size={80}/>
              </div>
              <div className="reviewHeaderInfo">
                <h3>
                  <Link to={`/profile/${review.username}`}>{review.display_name}</Link>
                </h3>

                <div className="reviewStars">
                  <Stars value={review.stars}/>
                </div>
              </div>
            </div>

            {review.description && (
              <div className="reviewBody">
                <div className="reviewDescription">
                  <p>{review.description}</p>
                </div>
              </div>
            )}

            <div className="reviewFooter">
              <div className="reviewDates">
                <p>Last Reviewed: {new Date(review.created_at).toLocaleDateString('nb-NO')}</p>
                <p>Last Updated: {new Date(review.updated_at).toLocaleDateString('nb-NO')}</p>
              </div>
              {user?.account_id === review.account_id && (
                <button onClick={onDeleteReview}>Delete Review</button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="comments">
        <div className="commentsHeader">
          <h2>Comments</h2>
          <select value={sort} onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}>
            
            <option value='newest'>Newest</option>
            <option value='oldest'>Oldest</option>
          </select>
        </div>
        
        {user?.account_id !== null && (
          <form onSubmit={onComment}>
            <textarea
              value={newComment}
              className="textarea"
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={1000}
              placeholder="Write a comment for this review!"
            />
            <button type="submit" disabled={newComment.trim() === ''}>Post</button>
          </form>
        )}

        {error && <p>{error}</p>}

        <div className="commentsBody">
          {sortedComments.map((comment) => (
            <div className="comment" key={comment.comment_id}>
              <div className="commentProfilePicture">
                <ProfilePicture account_id={comment.account_id} size={50}/>
              </div>
              <div className="commentInfo">
                <div className="commentProfileDisplayName">
                  <Link to={`/profile/${comment.username}`}>
                    <h3>{comment.display_name}</h3>
                  </Link>
                </div>
                <div className="commentDescription">
                  <p>{comment.comment}</p>
                </div>
                {user?.account_id === comment.account_id && (
                  <button onClick={() => onDeleteComment(comment.comment_id)}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Review;