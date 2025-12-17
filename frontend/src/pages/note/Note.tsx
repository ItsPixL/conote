import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleNote } from "../../utils/notesApi";
import StructuredNoteEditor from "./StructuredNoteEditor";
import Loader from "../../components/Loader";
import type { NoteType } from "../../utils/types";
import "./Note.css";

const Note = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState<NoteType | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchNote = async () => {
      const data = await getSingleNote(noteId);
      setNote(data.content.note);
    };

    fetchNote();
  }, [noteId]);

  if (!note) return <Loader />;

  return (
    <div className="note">
      <h1 className="note__title">{note.title}</h1>
      <h1 className="note__desc">{note.description}</h1>
      <StructuredNoteEditor
        noteId={noteId ? noteId : ""}
        user={user}
      />
    </div>
  );
};

export default Note;
