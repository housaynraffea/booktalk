import { Link } from 'react-router-dom';

const HomeButton = () => {
    return (
        <Link to="/">
            <img src="/buttons/HomeButton.svg" width="35px"/>
        </Link>
    );
};

export default HomeButton;