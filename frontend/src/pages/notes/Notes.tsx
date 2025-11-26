// ./pages/notes/Notes.tsx

// Imports
import { useState, useEffect } from "react";
import { getUserNotes } from "../../utils/notesApi";
import { toast } from "react-hot-toast";
import "./Notes.css";

// Notes
const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState<string>("");

  const testNote = {
    id: 1,
    userId: 1,
    title: "A New Note",
    content: "This is the content of the note",
    createdTime: "2025-11-26T23:00:00+00:00",
    updatedTime: "2025-11-27T02:00:00+00:00",
  };

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

  return (
    <div className="notes-page">
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
