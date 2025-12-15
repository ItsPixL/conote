import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { deleteNote } from "../../utils/notesApi";
import { useNavigate } from "react-router-dom";
import type { NoteType } from "../../utils/types";
import "./NoteThumbnail.css";

const NoteThumbnail = ({
  id,
  userId,
  title,
  description,
  content,
  createdTime,
  updatedTime,
}: NoteType) => {
  const navigate = useNavigate();

  const openNote = () => {
    navigate(`/notes/${id}`);
  };

  const onDelete = async () => {
    const res = await deleteNote(id);
    console.log(res);
    toast.success("Successfully deleted note!");
    window.location.reload();
  };

  return (
    <div className="note__thumbnail" onClick={openNote}>
      <div className="note__thumbnail__img"></div>

      <div className="note__thumbnail__titleCont">
        <div className="note__thumbnail__titleCont__title">{title}</div>

        <span
          className="material-symbols-outlined"
          onClick={(e) => {
            e.stopPropagation(); // prevents opening the note__thumbnail
            onDelete();
          }}
        >
          delete
        </span>
      </div>

      <div className="note__thumbnail__description">{description}</div>
      <div className="note__thumbnail__time">
        Last Updated: {formatDate(updatedTime)}
      </div>
    </div>
  );
};

export default NoteThumbnail;
