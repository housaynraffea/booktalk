import { Link } from "react-router-dom";
import { useAuth } from "@/common/context/useAuth";

const API_URL = import.meta.env.VITE_API_URL;
const placeholder_profile_picture = "/buttons/ProfileButton.svg"

const ProfileButton = () => {
    const { user, logout } = useAuth();

    const profilePath = user ? `/profile/${user.username}` : "/login";
    const profilePicture = user ? `${API_URL}/users/${user.account_id}/avatar` : placeholder_profile_picture;

    return (
        <Link to={profilePath}>
            <img src={profilePicture} 
                 width="35px" 
                 alt="Profile"
                 onError={(error) => {
                    error.currentTarget.onerror = null;
                    error.currentTarget.src = placeholder_profile_picture;
                }}/>
        </Link>
    );
};

export default ProfileButton;