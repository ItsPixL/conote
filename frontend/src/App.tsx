import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, RequireAuth, RequireGuest } from "./context/AuthContext";
import NavBar from "./components/Navbar";
import Home from "./pages/home/Home";
import Notes from "./pages/notes/Notes";
import Note from "./pages/note/Note";
import AuthPage from "./pages/auth/AuthPage";
import LoginForm from "./pages/auth/LogInForm";
import SignUpForm from "./pages/auth/SignUpForm";
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <NavBar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <AuthPage
                  title="Log In"
                  subtitle="Log in to continue to CoNote!"
                  redirectText="Don't have an account?"
                  redirectPath="/signup"
                  redirectLinkText="Sign Up"
                  FormComponent={LoginForm}
                />
              </RequireGuest>
            }
          />
          <Route
            path="/signup"
            element={
              <RequireGuest>
                <AuthPage
                  title="Sign Up"
                  subtitle="Create an account to use CoNote!"
                  redirectText="Already have an account?"
                  redirectPath="/login"
                  redirectLinkText="Log In"
                  FormComponent={SignUpForm}
                />
              </RequireGuest>
            }
          />

          {/* Protected routes */}
          <Route
            path="/notes"
            element={
              <RequireAuth>
                <Notes />
              </RequireAuth>
            }
          />
          <Route
            path="/notes/:noteId"
            element={
              <RequireAuth>
                <Note />
              </RequireAuth>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
