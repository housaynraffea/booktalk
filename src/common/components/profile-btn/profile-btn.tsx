import { Link } from "react-router-dom";

const ProfileButton = () => {
    return (
        <div>
            <Link to="/profile">
                <img src="/public/buttons/ProfileButton.svg" width="35px"/>
            </Link>
        </div>
    );
};

export default ProfileButton;