import { AxiosError } from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../utils/api";
import { type LoginData, type ErrorResponse, type User } from "../utils/types";
import { AuthContext } from "../context/AuthContext";

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

  const isAxiosError = (err: unknown): err is AxiosError => {
    return (err as AxiosError).isAxiosError !== undefined;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authApi.post("/auth/login", formData);
      const { token, user } = res.data.data as {
        token: string;
        user: User;
      };
      console.log(token, user);

      auth?.login(token, user);
      navigate("/notes");

      // Catch block
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as ErrorResponse;
        const errorMessage = errorData.message;

        if (errorMessage === "Invalid credentials") {
          setError("Incorrect email or password. Please try again.");
        } else if (errorMessage === "User not found") {
          setError("No account found with this email.");
        } else {
          setError(
            "An error occurred while logging in. Please try again later."
          );
        }
      } else {
        setError("An unknown error occurred.");
      }
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
      {error && (
        <p style={{ color: "red" }} className="error">
          {error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
