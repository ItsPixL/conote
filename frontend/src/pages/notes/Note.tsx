import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { deleteNote } from "../../utils/notesApi";
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
  const onDelete = async () => {
    const res = await deleteNote(id);
    console.log(res);
    toast.success("Successfully deleted note!");
    window.location.reload();
  };

  return (
    <div className="note">
      <div className="note__thumbnail"></div>
      <div className="note__titleCont">
        <div className="note__titleCont__title">{title}</div>
        <span className="material-symbols-outlined" onClick={onDelete}>
          delete
        </span>
      </div>
      <div className="note__description">{description}</div>
      <div className="note__time">Last Updated: {formatDate(updatedTime)}</div>
    </div>
  );
};

export default Note;
