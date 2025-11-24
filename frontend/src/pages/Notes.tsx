import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { getUserNotes } from "../utils/notesApi";

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
      }
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <span>Welcome, {auth.user.username}</span>
      <h2>{message}</h2>
      <button onClick={auth.logout}>Logout</button>
      <ul>
        {notes.map((note: any) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
