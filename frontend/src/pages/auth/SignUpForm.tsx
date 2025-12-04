import AuthForm from "./AuthForm";
import { signUp } from "../../utils/authApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { SignUpData } from "../../utils/types";

const SignupForm = () => {
  const navigate = useNavigate();

  const handleSignup = async (formData: SignUpData) => {
    await signUp(formData);
    toast.success("Account created! Please log in.");
    navigate("/login");
  };

  return (
    <AuthForm<SignUpData>
      fields={[
        { name: "username", placeholder: "Username" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      onSubmit={handleSignup}
      buttonText="Sign Up"
      declaration='By clicking "Sign Up", you agree to CoNote’s Privacy Policy and Terms.'
    />
  );
};

export default SignupForm;
