// ./notes/CreateNoteForm.tsx

// Imports
import { useState } from "react";
import toast from "react-hot-toast";
import "./CreateNoteForm.css";

// Types
import { type CreateNoteFormProps } from "../../utils/types";
import { createNewNote } from "../../utils/notesApi";

// Create Note Form
const CreateNoteForm = ({ closeForm }: CreateNoteFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [noteType, setNoteType] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createNewNote(title, description, noteType);

    const newNote = {
      title,
      description,
      type: noteType,
    };

    console.log("New Note:", newNote);

    setTitle("");
    setDescription("");
    setNoteType("");

    toast.success("Note created successfully!");
  };

  return (
    <div className="create-note-form-container">
      <div className="create-note-form">
        <h2>Create New Note</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <select
            name="noteType"
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select note type
            </option>
            <option value="structured">Structured (Document)</option>
            <option value="unstructured">Unstructured (Whiteboard)</option>
          </select>

          <button type="submit">Create Note</button>
        </form>
        <button onClick={closeForm} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateNoteForm;
