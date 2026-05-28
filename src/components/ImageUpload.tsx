import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

type Props = {
  bucket: "casino-logos" | "blog-images";
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  folder?: string;
};

export function ImageUpload({ bucket, value, onChange, label = "Kuva", folder = "" }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maksimi tiedostokoko 5 MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("Kuva ladattu");
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-24 w-24 object-cover rounded-lg border border-[color:var(--gold)]/40" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[color:var(--danger)] text-background flex items-center justify-center"
            aria-label="Poista kuva"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 h-24 w-full border-2 border-dashed border-[color:var(--gold)]/40 rounded-lg cursor-pointer hover:bg-surface text-sm text-muted-foreground">
          <Upload className="w-4 h-4" />
          {uploading ? "Ladataan..." : "Valitse kuva (max 5 MB)"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      )}
    </div>
  );
}