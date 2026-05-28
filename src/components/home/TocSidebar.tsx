import { TOC } from "./constants";

/** Sivupalkin sisällysluettelo. */
export function TocSidebar() {
  return (
    <div className="bg-surface gold-border rounded-xl overflow-hidden lg:sticky lg:top-24">
      <div className="bg-[color:var(--gold)]/10 px-5 py-3 border-b border-[color:var(--gold)]/30">
        <h3 className="font-display text-xl text-gold">Sisällysluettelo</h3>
      </div>
      <ol className="p-5 space-y-3 text-sm">
        {TOC.map((item, i) => (
          <li key={item.id} className="flex gap-3 border-b border-[color:var(--gold)]/10 pb-3 last:border-0 last:pb-0">
            <span className="text-gold font-bold tabular-nums shrink-0">{i + 1}.</span>
            <a href={`#${item.id}`} className="text-foreground/85 hover:text-gold">{item.label}</a>
          </li>
        ))}
      </ol>
    </div>
  );
}