// ./pages/auth/LoginForm.tsx

// Imports
import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../utils/authApi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

// Types
import {
  type LoginData,
  type LoginErrorResponse,
  type LoginSuccessResponse,
} from "../../utils/types";

// Login Form
const LoginForm = () => {
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const onSuccess = (res: LoginSuccessResponse) => {
      const { token, user } = res.data.data;
      auth?.login(token, user);
      toast.success("Logged in successfully!");
      navigate("/notes");
    };

    const onFail = (err: unknown) => {
      if (axios.isAxiosError<LoginErrorResponse>(err)) {
        const msg =
          err.response?.data?.message || "An error occurred while logging in";

        if (msg === "Invalid credentials" || msg === "User not found") {
          setError(
            msg === "Invalid credentials" ? "Incorrect email or password." : msg
          );
        } else {
          toast.error(msg);
        }
        return;
      }

      toast.error("Network error. Please check your connection.");
    };

    try {
      const res = await logIn(formData);
      onSuccess(res);
    } catch (err: unknown) {
      onFail(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Log In</button>

      <p className="declaration">
        By clicking "Log In", you agree to CoNote's Privacy Policy and Terms and
        Conditions.
      </p>

      <p className="error">{error || "\u00A0"}</p>
    </form>
  );
};

export default LoginForm;
