import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export default function StructuredNoteEditor({ noteId, user }: any) {
  // Create Y.Doc
  const ydoc = new Y.Doc();

  // Connect to backend WebSocket server
  const provider = new WebsocketProvider(
    "ws://127.0.0.1:8000/ws", // FOR SHIVANSH
    noteId,
    ydoc
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,

      Collaboration.configure({
        document: ydoc,
      }),

      CollaborationCursor.configure({
        provider,
        user: {
          name: user.username,
          color: "#ff00ff",
        },
      }),
    ],
  });

  return (
    <div className="editor-wrapper">
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
