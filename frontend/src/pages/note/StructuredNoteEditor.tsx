import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";

export default function StructuredNoteEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p>Start typing...</p>",
  });

  return (
    <div className="editor-wrapper">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
