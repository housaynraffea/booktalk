import { Link } from "react-router-dom";

const ProfileButton = () => {
    return (
        <Link to="/profile">
            <img src="/buttons/ProfileButton.svg" width="35px"/>
        </Link>
    );
};

export default ProfileButton;