// ./pages/notes/Note.tsx

// Imports
import { formatDate } from "../../utils/formatDate";
import "./Note.css";

// Types
import { type NoteType } from "../../utils/types";

// Note
const Note = ({
  id,
  userId,
  title,
  description,
  content,
  createdTime,
  updatedTime,
}: NoteType) => {
  return (
    <div className="note">
      <div className="thumbnail"></div>
      <div className="title">{title}</div>
      <div className="description">{description}</div>
      <div className="time">Last Updated: {formatDate(updatedTime)}</div>
    </div>
  );
};

export default Note;
