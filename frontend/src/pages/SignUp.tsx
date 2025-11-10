// import React from "react";
import SignUpForm from "../components/SignUpForm";
import "./SignUp.css";

export const SignUp = () => {
  return (
    <div className="sign-up-page">
      <div className="sign-up-box">
        <div className="text">
          <h1>Sign Up</h1>
          <p>Create an account to use CoNote!</p>
          <p>
            Already have an account? <a>Log In</a>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};
