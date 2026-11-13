import { Link } from 'react-router-dom';

const SettingsButton = () => {
    return (
        <Link to="/settings">
            <img src="/buttons/SettingsButton.svg" width="25px"/>
        </Link>
    );
};

export default SettingsButton;