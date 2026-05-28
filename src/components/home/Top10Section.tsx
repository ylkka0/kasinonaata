import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CasinoCard } from "@/components/CasinoCard";
import { CURRENT_MONTH, CURRENT_YEAR, FILTERS, UPDATED_DATE_SHORT } from "./constants";
import { TocSidebar } from "./TocSidebar";
import { NewsletterSidebar } from "./NewsletterSidebar";
import { NaataQuoteSidebar } from "./NaataQuoteSidebar";

/** TOP 10 -kasinolista suodattimineen + sivupalkki. */
export function Top10Section() {
  const [filter, setFilter] = useState<string>("all");
  const { data: casinos = [] } = useQuery({
    queryKey: ["casinos-top"],
    queryFn: async () => {
      const { data, error } = await supabase.from("casinos").select("*").order("ranking").limit(10);
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    if (filter === "all") return casinos;
    return casinos.filter((c) => c.tags?.includes(filter));
  }, [casinos, filter]);

  return (
    <section id="top10" className="container mx-auto px-4 py-16 scroll-mt-24">
      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <h2 className="font-display text-4xl">🏆 KASINONÄÄDÄN TOP 10 — {CURRENT_YEAR} {CURRENT_MONTH.toUpperCase()}N PARHAAT</h2>
          <p className="text-sm text-muted-foreground mb-6">Järjestyksessä Kasinonäädän kokonaisarvosanan mukaan. Päivitetty {UPDATED_DATE_SHORT}.</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === f.id ? "bg-[color:var(--gold)] text-background" : "border border-[color:var(--gold)]/30 text-foreground/80 hover:bg-surface"}`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((c, i) => <CasinoCard key={c.id} casino={c} rank={i + 1} compact />)}
            {filtered.length === 0 && <p className="text-muted-foreground text-center py-12">Ei tuloksia tällä suodattimella.</p>}
          </div>

          <div className="text-center mt-8">
            <Link to="/kasinot" className="inline-block px-6 py-3 rounded-lg border border-[color:var(--gold)]/40 text-gold font-bold uppercase tracking-wider text-sm hover:bg-surface">
              Lataa lisää kasinoita ↓
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <TocSidebar />
          <NewsletterSidebar />
          <NaataQuoteSidebar />
        </aside>
      </div>
    </section>
  );
}