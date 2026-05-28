import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Ohut, jatkuvasti rullaava kasinolista (marquee).
 * Käytetään hero-osion alapuolella muistutuksena.
 */
export function CasinoTicker() {
  const { data: casinos = [] } = useQuery({
    queryKey: ["ticker-casinos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("casinos")
        .select("id, slug, name, logo_url, rating, bonus_text")
        .order("ranking")
        .limit(15);
      return data ?? [];
    },
    staleTime: 60_000,
  });

  if (casinos.length === 0) return null;
  const items = [...casinos, ...casinos]; // duplicate for seamless loop

  return (
    <div className="relative border-y border-[color:var(--gold)]/20 bg-surface/60 overflow-hidden py-3">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      <div className="flex gap-4 ticker-track whitespace-nowrap">
        {items.map((c, i) => (
          <Link
            key={`${c.id}-${i}`}
            to="/kasinot/$slug"
            params={{ slug: c.slug }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[color:var(--gold)]/30 bg-background/40 hover:bg-surface-2 hover:border-[color:var(--gold)]/60 transition-colors shrink-0"
          >
            {c.logo_url && (
              <img src={c.logo_url} alt={c.name} className="w-7 h-7 rounded object-contain bg-background/60 p-0.5" loading="lazy" />
            )}
            <span className="font-display text-base text-foreground">{c.name}</span>
            {c.rating != null && <span className="text-xs text-gold font-bold">★ {Number(c.rating).toFixed(1)}</span>}
            {c.bonus_text && <span className="text-xs text-foreground/70 hidden md:inline">— {c.bonus_text}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
