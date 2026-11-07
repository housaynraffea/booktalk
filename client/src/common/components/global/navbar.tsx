import '@/common/styles/navbar.css';
import '@/common/styles/index.css'
import SearchField from '@/common/components/global/search-field';
import HomeButton from './home-btn';
import ProfileButton from './profile-btn';
import SettingsButton from './settings-btn';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbarLeft"><HomeButton/></div>
      <div className="navbarMiddle"><SearchField/></div>
      <div className="navbarRight"><SettingsButton/><ProfileButton/></div>
    </div>
  );
};

export default Navbar;