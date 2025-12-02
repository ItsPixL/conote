// ./components/Navbar.tsx

// Imports
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useLogout";
import "./Navbar.css";

// Navbar
const Navbar = () => {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <nav className="navbar">
      <Link to="/home" className="logo">
        CoNote
      </Link>
      {user ? (
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      ) : (
        <div className="links">
          <Link to="/login" className="link">
            Login
          </Link>
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
