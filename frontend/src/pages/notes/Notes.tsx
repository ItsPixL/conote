// ./pages/notes/Notes.tsx

// Imports
import { useState, useEffect } from "react";
import { getUserNotes } from "../../utils/notesApi";
import { toast } from "react-hot-toast";
import Note from "./Note";
import "./Notes.css";

// Types
import type { NoteType } from "../../utils/types";

// Notes
const Notes = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getUserNotes();
        // setNotes(data.notes);
        setMessage(data.message);
      } catch (err) {
        console.error("Error fetching notes:", err);
        toast.error("Error fetching notes. Try again later.");
      }
    };

    fetchNotes();

    const testNote = {
      id: 1,
      userId: 1,
      title: "A New Note",
      content: "This is the content of the note",
      description: "This is the description of the note",
      createdTime: "2025-11-26T23:00:00+00:00",
      updatedTime: "2025-11-27T02:00:00+00:00",
    };

    setNotes([
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
      testNote,
    ]);
  }, []);

  return (
    <div className="notes-page">
      <h2 className="message">{message}</h2>
      <button className="create-note-btn">
        <span className="material-symbols-outlined">add</span>
      </button>
      <div className="notes">
        {notes && notes.length > 0 ? (
          notes.map((note: NoteType) => (
            <Note
              key={note.id}
              id={note.id}
              userId={note.userId}
              title={note.title}
              description={note.description}
              content={note.content}
              createdTime={note.createdTime}
              updatedTime={note.updatedTime}
            />
          ))
        ) : (
          <div>User has no notes</div>
        )}
      </div>
    </div>
  );
};

export default Notes;
