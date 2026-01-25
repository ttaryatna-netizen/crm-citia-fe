"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="border-b bg-transparent p-1 flex flex-wrap gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bold") && "bg-muted text-primary",
        )}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("italic") && "bg-muted text-primary",
        )}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("strike") && "bg-muted text-primary",
        )}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="w-[1px] h-6 bg-border mx-1 self-center" />

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bulletList") && "bg-muted text-primary",
        )}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("orderedList") && "bg-muted text-primary",
        )}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[100px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col w-full rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="[&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:p-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
    </div>
  );
}
