import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CasinoCard } from "@/components/CasinoCard";

/** Selkeä, täydellinen kasinolista etusivulla. */
export function AllCasinosSection() {
  const { data: casinos = [], isLoading } = useQuery({
    queryKey: ["home-all-casinos"],
    queryFn: async () => (await supabase.from("casinos").select("*").order("ranking")).data ?? [],
    staleTime: 60_000,
  });

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4 border-b border-[color:var(--gold)]/20 pb-3 mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-1">Kasinonäätä suosittelee</div>
          <h2 className="font-display text-3xl md:text-4xl">Testatut kasinot</h2>
        </div>
        <Link to="/kasinot" className="hidden sm:inline-flex px-4 py-2 rounded-md border border-[color:var(--gold)]/40 text-gold text-sm font-semibold uppercase tracking-wider hover:bg-surface">
          Näytä kaikki →
        </Link>
      </div>
      {isLoading ? <p className="text-muted-foreground">Ladataan kasinoita…</p> : (
        <div className="grid lg:grid-cols-2 gap-4 max-w-6xl">
          {casinos.map((casino, index) => <CasinoCard key={casino.id} casino={casino} rank={index + 1} compact />)}
        </div>
      )}
    </section>
  );
}
