// import React from "react";
import LoginForm from "../components/LoginForm";
import "./SignUp.css";

const Login = () => {
  return (
    <div className="sign-up-page">
      <div className="sign-up-box">
        <div className="text">
          <h1>Log In</h1>
          <p>Log in to continue to CoNote!</p>
          <p>
            Don't have an account? <a>Sign Up!</a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login