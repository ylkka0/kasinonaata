import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CURRENT_MONTH, CURRENT_YEAR } from "./constants";

/** TOP 3 bonuskorttia (kuukauden parhaat tarjoukset). */
export function BonusesSection() {
  const { data: casinos = [] } = useQuery({
    queryKey: ["casinos-top"],
    queryFn: async () => {
      const { data } = await supabase.from("casinos").select("*").order("ranking").limit(10);
      return data ?? [];
    },
  });
  return (
    <section id="bonukset" className="container mx-auto px-4 py-16 border-t border-[color:var(--gold)]/15 scroll-mt-24">
      <h2 className="font-display text-4xl mb-2">🎁 {CURRENT_YEAR} {CURRENT_MONTH.toUpperCase()}N PARHAAT BONUKSET</h2>
      <p className="text-sm text-muted-foreground mb-8">Näädän käsin valitsemat parhaat tarjoukset tällä hetkellä</p>
      <div className="grid md:grid-cols-3 gap-6">
        {casinos.slice(0, 3).map((c, i) => (
          <div key={c.id} className="bg-surface gold-border rounded-xl p-6 flex flex-col">
            <div className="text-xs uppercase tracking-widest text-gold mb-2">
              {i === 0 ? "🥇 Paras bonus" : i === 1 ? "🥈 Toiseksi paras" : "🥉 Hyvä valinta"}
            </div>
            {c.logo_url && <img src={c.logo_url} alt={c.name} className="h-12 object-contain mb-3 self-start" />}
            <div className="font-display text-2xl text-foreground">{c.name}</div>
            <div className="text-base text-foreground/85 mt-2 flex-1">{c.bonus_text || "Tervetulobonus uusille pelaajille"}</div>
            <div className="text-xs text-muted-foreground mt-3 space-y-1">
              <div>✅ Lisenssi vahvistettu</div>
              <div>✅ Tarkasti vertailtu</div>
            </div>
            {c.affiliate_link && (
              <a href={c.affiliate_link} target="_blank" rel="nofollow sponsored noopener"
                className="mt-4 block text-center px-4 py-3 gradient-gold text-background font-bold uppercase tracking-wider rounded text-sm gold-glow">
                Lunasta bonus →
              </a>
            )}
            <div className="text-[10px] text-muted-foreground mt-2 text-center">18+ | T&C voimassa</div>
          </div>
        ))}
      </div>
    </section>
  );
}