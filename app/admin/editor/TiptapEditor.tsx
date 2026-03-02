"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { Markdown } from "tiptap-markdown";
import { Extension } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon, Highlighter } from "lucide-react";

// Extension to handle Cmd+A / Ctrl+A two-stage selection
const SelectAllExtension = Extension.create({
  name: "twoStageSelectAll",

  addKeyboardShortcuts() {
    return {
      "Mod-a": ({ editor }: { editor: any }) => {
        const { state, dispatch } = editor.view;
        const { selection, doc } = state;
        
        // If selection is already the entire document, let default behavior handle
        if (selection.from === 0 && selection.to === doc.content.size) {
          return false;
        }

        // Try to select the node the cursor is currently in
        const $from = selection.$from;
        let targetNode = null;
        let depth = $from.depth;

        // Find the most immediate parent block node (e.g. Paragraph or List Item)
        while (depth > 0) {
          const node = $from.node(depth);
          if (node.type.isBlock) {
            targetNode = node;
            break;
          }
          depth--;
        }

        if (targetNode) {
          const startPos = $from.before(depth) + 1; // Start of the node content
          const endPos = startPos + targetNode.content.size; // End of node content

          // If the current selection exactly matches the node content, select the whole doc
          if (selection.from === startPos && selection.to === endPos) {
            editor.commands.selectAll();
            return true;
          }

          // Otherwise, select just the block node content
          dispatch(state.tr.setSelection(
            state.selection.constructor.create(state.doc, startPos, endPos)
          ));
          return true;
        }

        return false;
      }
    };
  }
});

// Plugin for handling image drops and pastes
const ImageUploadPlugin = new Plugin({
  key: new PluginKey("imageUpload"),
  props: {
    handlePaste(view, event) {
      const items = Array.from(event.clipboardData?.items || []);
      const image = items.find((item) => item.type.startsWith("image"));
      
      if (image) {
        event.preventDefault();
        uploadAndInsertImage(image.getAsFile(), view);
        return true;
      }
      return false;
    },
    handleDrop(view, event, slice, moved) {
      if (!moved && event.dataTransfer && event.dataTransfer.files) {
        const image = Array.from(event.dataTransfer.files).find((file) => file.type.startsWith("image"));
        if (image) {
          event.preventDefault();
          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (coordinates) {
            uploadAndInsertImage(image, view, coordinates.pos);
          }
          return true;
        }
      }
      return false;
    }
  }
});

async function uploadAndInsertImage(file: File | null, view: any, pos?: number) {
  if (!file) return;

  try {
    // 1. Get an upload URL
    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filename: file.name, content_type: file.type }),
    });
    const { upload_url, key, public_url } = await res.json();

    // 2. Upload file directly
    await fetch(upload_url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    // 3. Construct public R2 URL and insert into document
    const publicUrl = public_url || `/r2/${key}`;
    const { schema } = view.state;
    const node = schema.nodes.image.create({ src: publicUrl, alt: "Uploaded image" });
    
    const transaction = view.state.tr.insert(pos !== undefined ? pos : view.state.selection.from, node);
    view.dispatch(transaction);
  } catch (err) {
    console.error("Image upload failed:", err);
    alert("Image upload failed. Please try again.");
  }
}

export default function TiptapEditor({ defaultValue }: { defaultValue: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Highlight,
      Markdown,
      SelectAllExtension,
      Extension.create({
        name: 'imageUploadHandling',
        addProseMirrorPlugins() {
          return [ImageUploadPlugin];
        }
      })
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  // Extract Markdown content on the fly
  const markdownContent = editor.storage.markdown.getMarkdown();

  return (
    <div className="flex flex-col flex-1 border rounded-lg bg-white relative">
      <input type="hidden" name="markdown" value={markdownContent} />
      
      {/* Floating Toolbar */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex bg-white shadow-lg border rounded-lg overflow-hidden p-1 gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive("bold") ? "text-blue-500 bg-blue-50" : "text-gray-700"}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive("italic") ? "text-blue-500 bg-blue-50" : "text-gray-700"}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive("strike") ? "text-blue-500 bg-blue-50" : "text-gray-700"}`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive("code") ? "text-blue-500 bg-blue-50" : "text-gray-700"}`}
            title="Code"
          >
            <Code size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              } else if (url === "") {
                editor.chain().focus().unsetLink().run();
              }
            }}
            className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive("link") ? "text-blue-500 bg-blue-50" : "text-gray-700"}`}
            title="Link"
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive("highlight") ? "text-blue-500 bg-blue-50" : "text-gray-700"}`}
            title="Highlight"
          >
            <Highlighter size={16} />
          </button>
        </BubbleMenu>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 overflow-y-auto p-4 tiptap-container" style={{ minHeight: "500px", color: "black" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
