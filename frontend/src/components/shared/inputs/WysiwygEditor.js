"use client";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
} from "react-icons/fa";

const WysiwygEditor = ({
  value = "",
  onChange,
  placeholder = "Enter your text here...",
  className = "",
  disabled = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[120px] p-3 border border-neutral-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 prose max-w-none text-sm text-neutral-700",
      },
    },
    immediatelyRender: false, // Optimize for React 19
  });

  // Sync editor content with prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Set placeholder
  useEffect(() => {
    if (editor) {
      editor.options.element.setAttribute("data-placeholder", placeholder);
    }
  }, [editor, placeholder]);

  if (!editor) {
    return null;
  }

  const handleLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={`wysiwyg-editor ${className}`}>
      {/* Toolbar */}
      <div className="border border-neutral-300 border-b-0 rounded-t-lg bg-neutral-50 p-2 flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 ${
            editor.isActive("bold") ? "bg-neutral-200" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Bold"
        >
          <FaBold className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 ${
            editor.isActive("italic") ? "bg-neutral-200" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Italic"
        >
          <FaItalic className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 ${
            editor.isActive("underline") ? "bg-neutral-200" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Underline"
        >
          <FaUnderline className="w-3 h-3" />
        </button>
        <div className="w-px bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 ${
            editor.isActive("bulletList") ? "bg-neutral-200" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Bullet List"
        >
          <FaListUl className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 ${
            editor.isActive("orderedList") ? "bg-neutral-200" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Numbered List"
        >
          <FaListOl className="w-3 h-3" />
        </button>
        <div className="w-px bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={handleLink}
          disabled={disabled}
          className={`p-2 rounded hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 ${
            editor.isActive("link") ? "bg-neutral-200" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Link"
        >
          <FaLink className="w-3 h-3" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Custom styles */}
      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
        .ProseMirror {
          background: white;
          position: relative;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default WysiwygEditor;
