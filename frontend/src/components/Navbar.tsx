// ./components/Navbar.tsx

// Imports
import { Link } from "react-router-dom";
import "./Navbar.css";

// Navbar
const Navbar = () => {
  return (
    <nav>
      <Link to="/home" className="logo">
        CoNote
      </Link>
      <div className="links">
        <Link to="/login" className="link">
          Login
        </Link>
        <Link to="/signup" className="link">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
