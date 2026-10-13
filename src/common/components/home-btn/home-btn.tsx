import { Link } from 'react-router-dom';

const HomeButton = () => {
    return (
        <div>
            <Link to="/">
                <img src="/public/buttons/HomeButton.svg" width="35px"/>
            </Link>
        </div>
    );
};

export default HomeButton;