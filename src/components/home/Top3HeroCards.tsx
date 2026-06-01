import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Database } from "@/integrations/supabase/types";
import { CURRENT_MONTH, CURRENT_YEAR } from "./constants";

type Casino = Database["public"]["Tables"]["casinos"]["Row"];

/** Välitön CTA: TOP 3 kasinoa hero-osiossa, animoitu lista. */
export function Top3HeroCards() {
  const [selected, setSelected] = useState<Casino | null>(null);
  const { data: casinos = [] } = useQuery({
    queryKey: ["casinos-top3"],
    queryFn: async () => {
      const { data } = await supabase.from("casinos").select("*").order("ranking").limit(3);
      return data ?? [];
    },
  });

  return (
    <div className="relative w-full">
      <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gold/80">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] animate-pulse" />
          UUDET KASINOT {CURRENT_YEAR} {CURRENT_MONTH.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        {casinos.map((c, i) => {
          const rankStyles = [
            "border-[color:var(--gold)]/80 shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--gold)_70%,transparent)] bg-gradient-to-br from-[#13245a]/95 to-[#0D1B3E]/95",
            "border-[color:var(--gold)]/50 bg-[#0D1B3E]/90",
            "border-[color:var(--gold)]/30 bg-[#0D1B3E]/85",
          ][i] ?? "";
          const rankBadge = [
            "gradient-gold text-background",
            "bg-[color:var(--gold)]/80 text-background",
            "bg-surface-2 text-gold border border-[color:var(--gold)]/60",
          ][i] ?? "";
          return (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c)}
            className={`top3-card top3-card-${i + 1} group relative block w-full text-left overflow-hidden rounded-2xl border-2 backdrop-blur p-3.5 md:p-4 ${rankStyles} hover:border-[color:var(--gold)] hover:gold-glow cursor-pointer`}
          >
            {i === 0 && (
              <div className="top3-crown absolute -top-3 right-3 text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">👑</div>
            )}
            <div className="flex items-center gap-3 md:gap-4 relative">
              <div className="relative shrink-0">
                {c.logo_url ? (
                  <img
                    src={c.logo_url}
                    alt={c.logo_alt ?? c.name}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-contain bg-background/60 p-1"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-surface" />
                )}
                <div className={`top3-rank absolute -top-2 -left-2 w-8 h-8 text-sm ${rankBadge} rounded-full font-display flex items-center justify-center shadow-lg`}>
                  {i + 1}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display text-lg md:text-xl text-white truncate">{c.name}</div>
                  <div className="inline-flex items-center gap-1 text-gold font-semibold shrink-0 text-sm">
                    <span>★</span>
                    <span>{Number(c.rating).toFixed(1)}</span>
                  </div>
                </div>
                <div className="font-semibold text-foreground/95 truncate text-sm">
                  {c.bonus_text ?? "Tervetulobonus uusille pelaajille"}
                </div>
                {c.review_text && (
                  <div className="text-xs text-muted-foreground truncate">
                    {c.review_text.slice(0, 70)}
                  </div>
                )}
              </div>

              <div className="hidden sm:flex shrink-0 text-gold text-2xl group-hover:translate-x-2 transition-transform duration-300">
                →
              </div>
            </div>

            <div className="top3-shimmer absolute left-0 right-0 bottom-0 h-[2px]" />
          </button>
        );})}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-[#0D1B3E] border-2 border-[color:var(--gold)]/60 max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {selected.logo_url && (
                    <img src={selected.logo_url} alt={selected.logo_alt ?? selected.name} className="w-14 h-14 rounded-lg object-contain bg-background/60 p-1" />
                  )}
                  <div className="min-w-0">
                    <DialogTitle className="font-display text-2xl text-white truncate">{selected.name}</DialogTitle>
                    <div className="text-gold font-semibold text-sm">★ {Number(selected.rating).toFixed(1)} / 10</div>
                  </div>
                </div>
              </DialogHeader>

              {selected.bonus_text && (
                <div className="bg-background/60 rounded-lg p-3">
                  <div className="text-[10px] uppercase tracking-widest text-gold">Bonus</div>
                  <div className="font-semibold text-foreground">{selected.bonus_text}</div>
                </div>
              )}

              {selected.review_text && (
                <DialogDescription className="text-sm text-foreground/85 leading-relaxed">
                  {selected.review_text}
                </DialogDescription>
              )}

              {((selected.pros && selected.pros.length > 0) || (selected.cons && selected.cons.length > 0)) && (
                <div className="bg-background/40 rounded-lg p-3">
                  <div className="text-[11px] uppercase tracking-widest text-gold mb-2 font-bold">Plussat & Miinukset</div>
                  <ul className="space-y-1 text-sm">
                    {selected.pros?.slice(0, 5).map((p, i) => (
                      <li key={`p-${i}`} className="flex gap-2">
                        <span className="text-[color:var(--success)] font-bold shrink-0">＋</span>
                        <span className="leading-snug">{p}</span>
                      </li>
                    ))}
                    {selected.cons?.slice(0, 3).map((c, i) => (
                      <li key={`c-${i}`} className="flex gap-2">
                        <span className="text-[color:var(--danger)] font-bold shrink-0">－</span>
                        <span className="leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <a
                  href={selected.affiliate_link ?? "#"}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="flex-1 text-center px-4 py-2.5 text-sm rounded-lg font-bold uppercase tracking-wider bg-[color:var(--success)] text-background hover:opacity-90 transition-opacity"
                >
                  Pelaa nyt →
                </a>
                <Link
                  to="/kasinot/$slug"
                  params={{ slug: selected.slug }}
                  onClick={() => setSelected(null)}
                  className="px-4 py-2.5 text-sm rounded-lg font-semibold uppercase tracking-wider border border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"
                >
                  Lue arvio
                </Link>
              </div>

              <div className="text-[10px] text-muted-foreground/70 text-center pt-1">
                18+ · Vain uusille pelaajille · T&amp;C voimassa · Pelaa vastuullisesti
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
