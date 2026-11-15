import { Link } from "react-router-dom";
import { useAuth } from "@/common/context/AuthContext";
import ProfilePicture from "./profile-picture";

const ProfileButton = () => {
    const { user } = useAuth();

    const profilePath = user ? `/profile/${user.username}` : "/login";

    return (
        <Link to={profilePath}>
            {user ? (
                <ProfilePicture account_id={user.account_id} size={30}/>
            ) : (
                <img src="/buttons/ProfileButton.svg" alt="Log in" width="30px"/>
            )}
        </Link>
    );
};

export default ProfileButton;