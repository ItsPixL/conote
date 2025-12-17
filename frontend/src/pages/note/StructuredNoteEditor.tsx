import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";

import { useMemo } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export default function StructuredNoteEditor({ noteId, user }: any) {
  if (!user) return null;

  const ydoc = useMemo(() => new Y.Doc(), []);

  const provider = useMemo(() => {
    return new WebsocketProvider(
      "ws://127.0.0.1:8000",
      noteId,
      ydoc
    );
  }, [noteId, ydoc]);

  provider.on("status", e => console.log("WS:", e.status))

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
    ],
  });

  return <EditorContent editor={editor} />;
}
