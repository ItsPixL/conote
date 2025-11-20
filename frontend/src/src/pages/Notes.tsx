import { useAuth } from "../hooks/useAuth";

const Notes = () => {
  const auth = useAuth();

  return (
    <div>
      <span>Welcome, {auth.user.username}</span>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
};

export default Notes;
