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
      >
        <span className="material-symbols-outlined">format_bold</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
      >
        <span className="material-symbols-outlined">format_italic</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
      >
        <span className="material-symbols-outlined">format_underlined</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "active" : ""}
      >
        <span className="material-symbols-outlined">format_h1</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
      >
        <span className="material-symbols-outlined">format_h2</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "active" : ""}
      >
        <span className="material-symbols-outlined">format_list_bulleted</span>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "active" : ""}
      >
        <span className="material-symbols-outlined">format_list_numbered</span>
      </button>

      <button onClick={() => editor.chain().focus().undo().run()}>
        <span className="material-symbols-outlined">undo</span>
      </button>

      <button onClick={() => editor.chain().focus().redo().run()}>
        <span className="material-symbols-outlined">redo</span>
      </button>
    </div>
  );
};

export default Toolbar;
