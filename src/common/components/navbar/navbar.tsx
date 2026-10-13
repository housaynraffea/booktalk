import './navbar.css';
import { Link } from 'react-router-dom';
import SearchField from '@/common/components/search-field/search-field';

const Navbar = () => {
  return (
    <div className="navbar">
      <div id="left"><Link to="/">Home</Link></div>
      <div id="middle"><SearchField/></div>
      <div id="right"><Link to="/profile">Profile</Link></div>
    </div>
  );
};

export default Navbar;