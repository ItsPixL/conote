import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { getUserNotes } from "../utils/notesApi";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

const Notes = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getUserNotes();
        setNotes(data.notes);
        setMessage(data.message);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, []);

  const logout = () => {
    auth.logout();
    localStorage.removeItem("");
    navigate("/home");
  };

  return (
    <div className="notes-page">
      <span>Welcome, {auth.user.username}</span>
      <h2>{message}</h2>
      <button onClick={logout}>Logout</button>
      <ul>
        {notes && notes.length > 0 ? (
          notes.map((note: any) => <li key={note.id}>{note.title}</li>)
        ) : (
          <div>User has no notes</div>
        )}
      </ul>
    </div>
  );
};

export default Notes;
