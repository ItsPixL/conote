import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleNote } from "../../utils/notesApi";
import type { NoteType } from "../../utils/types";

const Note = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState<NoteType | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      const data = await getSingleNote(noteId);
      setNote(data.content.note);
    };

    fetchNote();
  }, [noteId]);

  if (!note) return <div>Loading...</div>;

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
};

export default Note;
