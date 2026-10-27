import { Link } from "react-router-dom";
import '@/common/styles/profile-book-review-card.css';

const ProfileBookReviewCard = () => {
    const reviewElementWidths = "14px";


    return ( // to="/review/id?="
        <Link to="/review">
            <div className="cardBody">
                <div className="cardBookCover">
                    <img src="/book-example.png" width="150px"/>
                </div>
                <div className="cardInfo">
                    <div className="cardInfoHeader">
                        <h4>Dungeon Crawler Caaaaaarl</h4>
                    </div>
                    
                    <div className="cardInfoStars">
                        <img src="/elements/star-1.svg" width={reviewElementWidths}/>
                        <img src="/elements/star-1.svg" width={reviewElementWidths}/>
                        <img src="/elements/star-1.svg" width={reviewElementWidths}/>
                        <img src="/elements/star-0.svg" width={reviewElementWidths}/>
                        <img src="/elements/star-0.svg" width={reviewElementWidths}/>
                    </div>
                    
                    <div className="cardInfoDescription">
                        <p>Description</p>
                    </div>

                    <div className="cardFooter">
                        <div className="cardFooterDates">
                            <p>Review date</p>
                            <p>Last updated</p>
                        </div>

                        <div className="cardFooterLikeButton">
                            <img src="/elements/heart-1.svg" width={reviewElementWidths}/> <span>100.9k</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProfileBookReviewCard;