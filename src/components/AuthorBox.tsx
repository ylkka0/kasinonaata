import martenLogo from "@/assets/marten-logo.png";

type AuthorBoxProps = {
  author?: string;
  reviewer?: string;
  updated?: string;
  readTime?: string;
};

export function AuthorBox({
  author = "Janne Manninen",
  reviewer = "Kasinonäätä",
  updated,
  readTime = "8 min",
}: AuthorBoxProps) {
  const updatedStr = updated ?? new Date().toLocaleDateString("fi-FI");
  return (
    <div className="flex flex-wrap items-center gap-4 bg-surface gold-border rounded-xl p-4 my-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[color:var(--gold)]/20 border border-[color:var(--gold)]/50 flex items-center justify-center font-display text-gold text-lg">
          {author.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        </div>
        <div className="text-sm leading-tight">
          <div className="font-bold text-foreground">{author}</div>
          <div className="text-xs text-muted-foreground">Kasinotestaaja, 200+ testiä</div>
        </div>
      </div>
      <div className="hidden sm:block w-px h-8 bg-[color:var(--gold)]/20" />
      <div className="flex items-center gap-2">
        <img src={martenLogo} alt="" width={32} height={32} className="rounded-full" />
        <div className="text-xs leading-tight">
          <div className="text-muted-foreground">Tarkastanut</div>
          <div className="font-semibold text-gold">{reviewer}</div>
        </div>
      </div>
      <div className="ml-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>📅 Päivitetty: <strong className="text-foreground">{updatedStr}</strong></span>
        <span>⏱ Lukuaika: <strong className="text-foreground">{readTime}</strong></span>
      </div>
    </div>
  );
}