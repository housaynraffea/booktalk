import { Link } from "react-router-dom";
import '@/common/styles/profile-book-review-card.css';
import type { Review } from "@/api/review";
import { coverURL } from "@/api/book";
import Stars from "@/common/components/review/stars";

type Prop = {
    review: Review;
}

const ProfileBookReviewCard = ({ review }: Prop) => {
    return (
        <Link to={`/review/${review.review_id}`}>
            <div className="cardBody">
                <div className="cardBookCover">
                    <img src={coverURL(review.cover, 'M')} alt={review.title} width="150px"/>
                </div>
                <div className="cardInfo">
                    <div className="cardInfoHeader">
                        <h4>{review.title}</h4>
                    </div>
                    
                    <div className="cardInfoStars">
                        <Stars value={review.stars} size={32}/>
                    </div>
                    
                    {review.description && (
                        <div className="cardInfoDescription">
                            <p>{review.description}</p>
                        </div>
                    )}

                    <div className="cardFooter">
                        <div className="cardFooterDates">
                            <p>Last Reviewed: {new Date(review.created_at).toLocaleDateString('nb-NO')}</p>
                            <p>Last Updated: {new Date(review.updated_at).toLocaleDateString('nb-NO')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProfileBookReviewCard;