// ./pages/notes/Notes.tsx

// Imports
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { getUserNotes } from "../../utils/notesApi";
import { toast } from "react-hot-toast";
import "./Notes.css";

// Notes
const Notes = () => {
  const auth = useAuth();
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
        toast.error("Error fetching notes. Try again later.");
      }
    };

    fetchNotes();
  }, []);

  if (!auth.user) return <div>Loading...</div>;

  return (
    <div className="notes-page">
      <span>Welcome, {auth.user.username}</span>
      <h2>{message}</h2>
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
