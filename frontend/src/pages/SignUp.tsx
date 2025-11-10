// import React from "react";
import SignUpForm from "../components/SignUpForm";

export const SignUp = () => {
  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm onSuccess={onSuccess} />
    </div>
  );
};
