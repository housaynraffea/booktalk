import { useEffect, useState } from "react";
import { profilePictureURL } from "@/api/profile-picure";

type Props = {
    account_id: number;
    size: number;
    version?: number;
}

const FALLBACK = "/buttons/ProfileButton.svg";

const ProfilePicture = ({ account_id, size, version }: Props) => {
    const [failed, setFailed] = useState(false);

    useEffect(() => setFailed(false), [account_id, version]);

    return (
        <img
            src={failed ? FALLBACK : profilePictureURL(account_id, version)} 
            onError={() => setFailed(true)} 
            width={size} 
            height={size}
            alt="" 
            style={{ objectFit: "cover", borderRadius: "250px"}}
        />
    );
}

export default ProfilePicture;