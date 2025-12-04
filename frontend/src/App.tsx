import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, RequireAuth, RequireGuest } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NavBar from "./components/Navbar";
import Home from "./pages/home/Home";
import Notes from "./pages/notes/Notes";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <NavBar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <Login />
              </RequireGuest>
            }
          />
          <Route
            path="/signup"
            element={
              <RequireGuest>
                <SignUp />
              </RequireGuest>
            }
          />
          <Route
            path="/notes"
            element={
              <RequireAuth>
                <Notes />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
