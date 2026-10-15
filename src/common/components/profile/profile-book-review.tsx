import { Link } from "react-router-dom";
import '@/common/styles/profile-book-review.css';

const ProfileBookReview = () => {
    const reviewElementWidths = "14px";


    return (
        <Link to="/review">
            <div className="book-review">
                <div id="book-cover"><img src="/book-example.png" width="150px"/></div>
                <div className="review-info">
                    <div className="top">
                        <div id="review-title"><h4>Dungeon Crawler Caaaaaarl</h4></div>
                        <div id="review-stars">
                            <img src="/elements/star-1.svg" width={reviewElementWidths}/>
                            <img src="/elements/star-1.svg" width={reviewElementWidths}/>
                            <img src="/elements/star-1.svg" width={reviewElementWidths}/>
                            <img src="/elements/star-0.svg" width={reviewElementWidths}/>
                            <img src="/elements/star-0.svg" width={reviewElementWidths}/>
                        </div>
                        <div id="review-description">
                            <p>Description</p>
                        </div>
                    </div>
                    <div className="bottom">
                        <div id="review-dates">
                            <p>Review date</p>
                            <p>Last updated</p>
                        </div>
                        
                        <div id="review-likes">
                            <img src="/elements/heart-1.svg" width={reviewElementWidths}/> <span>100.9k</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProfileBookReview;