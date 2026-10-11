import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <Link className="navbar-btn" to="/">Home</Link>
      <Link className="navbar-btn" to="/search">Search</Link>
      <Link className="navbar-btn" to="/profile">Profile</Link>
    </div>
  );
};

export default Navbar;