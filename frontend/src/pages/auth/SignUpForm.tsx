import axios from "axios";
import React, { useState } from "react";
import { type SignUpData } from "../../utils/types";
import { signUp } from "../../utils/authApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signUp(formData);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err: unknown) {
      console.error("Signup error:", err);

      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as {
          message?: string;
          success?: boolean;
        };

        const msg = data.message || "An error occurred while signing up";

        if (
          msg === "Email already exists" ||
          msg === "Username already exists"
        ) {
          setError(msg);
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>

      <p className="declaration">
        By clicking "Sign Up", you agree to CoNote's Privacy Policy and Terms
        and Conditions.
      </p>

      <p className="error">{error || "\u00A0"}</p>
    </form>
  );
};

export default SignupForm;
