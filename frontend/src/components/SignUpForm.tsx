import React, { useState } from "react";
import { signup } from "../utils/api";
import { type SignupFormProps, type SignUpData } from "../utils/types";

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Sorry, but your signup failed. Please try again another time."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Sign Up</button>
      <p className="declaration">
        By clicking "Sign up", you are agreeing to CoNote's Privacy Policy and
        Terms and Conditions.
      </p>
      {error && (
        <p style={{ color: "red" }} className="error">
          {error}
        </p>
      )}
    </form>
  );
};

export default SignupForm;
