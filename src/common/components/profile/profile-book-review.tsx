import { Link } from "react-router-dom";
import '@/common/styles/profile-book-review.css';

const ProfileBookReview = () => {
    return (
        <div className="book-review">
            <Link to="/review">
                <table>
                    <tr>
                        <td><img src="/book-example.png" width="150px"/></td>
                        <td>
                            <h6>Display name's review</h6>
                            <p>stars</p>
                            <p>description</p>
                            <p>date</p>
                        </td>
                        <td><p>likes</p></td>
                    </tr>
                    <tr>

                    </tr>
                </table>
            </Link>
        </div>
    );
};

export default ProfileBookReview;