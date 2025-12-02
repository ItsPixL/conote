// ./pages/auth/SignUp.tsx

// Imports
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import "./SignUp.css";

// Sign Up
const SignUp = () => {
  const navigate = useNavigate();
  const redirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-box">
        <div className="text">
          <h1>Sign Up</h1>
          <p>Create an account to use CoNote!</p>
          <p>
            Already have an account? <a onClick={redirect}>Log In</a>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
