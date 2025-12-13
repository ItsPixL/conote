import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import { updateNote } from "../../utils/notesApi";
import type { StrucNoteEditorProps } from "../../utils/types";

export default function StructuredNoteEditor({
  note,
  setNote,
  noteId,
}: StrucNoteEditorProps) {
  const [debouncedContent, setDebouncedContent] = useState(note.content);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: note.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setNote((prev) => {
        if (!prev) return prev;
        return { ...prev, content: html };
      });

      setDebouncedContent(html);
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateNote(noteId, { content: debouncedContent });
    }, 500);

    return () => clearTimeout(timeout);
  }, [debouncedContent, noteId]);

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content);
    }
  }, [note.content, editor]);

  return (
    <div className="editor-wrapper">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
