import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "./SignUp.css";

const Login = () => {
  const navigate = useNavigate();
  const redirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-box">
        <div className="text">
          <h1>Log In</h1>
          <p>Log in to continue to CoNote!</p>
          <p>
            Don't have an account? <a onClick={redirect}>Sign Up</a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
