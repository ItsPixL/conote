import AuthForm from "./AuthForm";
import { logIn } from "../../utils/authApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { LoginData } from "../../utils/types";

const LoginForm = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogin = async (formData: LoginData) => {
    const res = await logIn(formData);
    const { token, user } = res.data.content;
    auth?.login(token, user);
    toast.success("Logged in successfully!");
    navigate("/notes");
  };

  return (
    <AuthForm<LoginData>
      fields={[
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleLogin}
      buttonText="Log In"
      declaration='By clicking "Log In", you agree to CoNote’s Privacy Policy and Terms.'
    />
  );
};

export default LoginForm;
