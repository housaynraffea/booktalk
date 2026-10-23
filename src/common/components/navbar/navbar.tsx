import '@/common/styles/navbar.css';
import SearchField from '@/common/components/search-field/search-field';
import HomeButton from '../home-btn/home-btn';
import ProfileButton from '../profile-btn/profile-btn';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbarLeft"><HomeButton/></div>
      <div className="navbarMiddle"><SearchField/></div>
      <div className="navbarRight"><ProfileButton/></div>
    </div>
  );
};

export default Navbar;