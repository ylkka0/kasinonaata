import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-4 max-w-full h-auto" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-gold underline", rel: "noopener" } }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[320px] px-4 py-3 focus:outline-none [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-[color:var(--gold)] [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-[color:var(--gold)] [&_a]:text-[color:var(--gold)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[color:var(--gold)] [&_blockquote]:pl-4 [&_blockquote]:italic",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === "" ? "empty" : "set"]);

  if (!editor) return null;

  const Btn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 text-sm rounded hover:bg-surface-2 ${active ? "bg-surface-2 text-gold" : "text-foreground/80"}`}
    >
      {children}
    </button>
  );

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Linkin URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run();
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const uploadImage = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5 MB");
    const ext = file.name.split(".").pop();
    const path = `inline/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
    toast.success("Kuva lisätty");
  };

  return (
    <div className="border border-[color:var(--gold)]/30 rounded bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-[color:var(--gold)]/20 px-2 py-1.5">
        <Btn title="Lihavointi" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></Btn>
        <Btn title="Kursiivi" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></Btn>
        <Btn title="Yliviivaus" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>
        <span className="w-px h-5 bg-[color:var(--gold)]/20 mx-1" />
        <Btn title="Otsikko 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Otsikko 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <span className="w-px h-5 bg-[color:var(--gold)]/20 mx-1" />
        <Btn title="Lista" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</Btn>
        <Btn title="Numeroitu lista" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</Btn>
        <Btn title="Lainaus" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>"</Btn>
        <span className="w-px h-5 bg-[color:var(--gold)]/20 mx-1" />
        <Btn title="Linkki" active={editor.isActive("link")} onClick={setLink}>🔗</Btn>
        <Btn title="Lisää kuva" onClick={() => fileRef.current?.click()}>🖼️</Btn>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadImage(f);
            e.target.value = "";
          }}
        />
        <span className="w-px h-5 bg-[color:var(--gold)]/20 mx-1" />
        <Btn title="Kumoa" onClick={() => editor.chain().focus().undo().run()}>↶</Btn>
        <Btn title="Tee uudelleen" onClick={() => editor.chain().focus().redo().run()}>↷</Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}