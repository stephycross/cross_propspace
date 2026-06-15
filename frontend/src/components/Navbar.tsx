import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiPlusSquare, FiGrid, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(): void {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">
            <FiHome size={20} />
          </span>
          PropSpace
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end className="navbar-link">
            <FiGrid size={17} />
            <span>Explore</span>
          </NavLink>

          {user ? (
            <>
              <NavLink to="/my-listings" className="navbar-link">
                <FiHome size={17} />
                <span>My Listings</span>
              </NavLink>
              <NavLink to="/properties/new" className="navbar-link">
                <FiPlusSquare size={17} />
                <span>Add Listing</span>
              </NavLink>
              <NavLink to="/profile" className="navbar-link">
                <FiUser size={17} />
                <span>{user.username}</span>
              </NavLink>
              <button className="navbar-logout" onClick={handleLogout}>
                <FiLogOut size={17} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar-link">
                Login
              </NavLink>
              <Link to="/register" className="btn btn-primary navbar-cta">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
