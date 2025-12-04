import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/home");
  };
};
