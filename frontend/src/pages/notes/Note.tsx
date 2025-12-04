import { formatDate } from "../../utils/formatDate";
import type { NoteType } from "../../utils/types";
import "./Note.css";

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
      <div className="note__thumbnail"></div>
      <div className="note__title">{title}</div>
      <div className="note__description">{description}</div>
      <div className="note__time">Last Updated: {formatDate(updatedTime)}</div>
    </div>
  );
};

export default Note;
