import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useLogout";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useAuth();
  const logout = useLogout();

  const logoutBtn = (
    <button onClick={logout} className="navbar__logoutBtn">
      Logout
    </button>
  );

  const loginBtn = (
    <div className="navbar__links">
      <Link to="/login" className="navbar__link">
        Login
      </Link>
      <Link to="/signup" className="navbar__link">
        Sign Up
      </Link>
    </div>
  );

  return (
    <nav className="navbar">
      <Link to={user ? "/notes" : "/home"} className="navbar__logo">
        CoNote
      </Link>
      {user ? logoutBtn : loginBtn}
    </nav>
  );
};

export default Navbar;
