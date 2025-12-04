import Note from "./Note";
import CreateNoteForm from "./CreateNoteForm";
import { useState, useEffect } from "react";
import { getUserNotes } from "../../utils/notesApi";
import { toast } from "react-hot-toast";
import type { NoteType } from "../../utils/types";
import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [createNotePopup, setCreateNotePopup] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getUserNotes();
        console.log(data);
        setNotes(data.content.notes ? data.content.notes : []);
        setMessage(data.message);
      } catch (err) {
        console.error("Error fetching notes:", err);
        toast.error("Error fetching notes. Try again later.");
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="notes">
      <h2 className="notes__message">{message}</h2>
      {createNotePopup ? (
        <CreateNoteForm
          closeForm={() => setCreateNotePopup(!createNotePopup)}
        />
      ) : (
        <button
          className="notes__createNoteBtn"
          onClick={() => setCreateNotePopup(!createNotePopup)}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      )}
      <div className="notes__grid">
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
