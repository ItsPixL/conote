import { useEffect, useState } from "react";

const Toolbar = ({ editor }: any) => {
  const [, setRerender] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => setRerender((x) => x + 1);

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}
        title="Bold (Ctrl+B)"
      >
        <span className="material-symbols-outlined">format_bold</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
        title="Italic (Ctrl+I)"
      >
        <span className="material-symbols-outlined">format_italic</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
        title="Underline (Ctrl+U)"
      >
        <span className="material-symbols-outlined">format_underlined</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "active" : ""}
        title="Heading 1 (Ctrl+Alt+1)"
      >
        <span className="material-symbols-outlined">format_h1</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        title="Heading 2 (Ctrl+Alt+2)"
      >
        <span className="material-symbols-outlined">format_h2</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "active" : ""}
        title="Bullet List (Ctrl+Shift+8)"
      >
        <span className="material-symbols-outlined">format_list_bulleted</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "active" : ""}
        title="Ordered List (Ctrl+Shift+9)"
      >
        <span className="material-symbols-outlined">format_list_numbered</span>
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo (Ctrl+Z)"
      >
        <span className="material-symbols-outlined">undo</span>
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <span className="material-symbols-outlined">redo</span>
      </button>
    </div>
  );
};

export default Toolbar;
