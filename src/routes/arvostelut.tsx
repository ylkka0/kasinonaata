import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { CmsExtra } from "@/components/CmsExtra";

export const Route = createFileRoute("/arvostelut")({
  head: () => ({
    meta: [
      { title: "Kasinoarvostelut lisensseittäin – Kasinonäätä" },
      {
        name: "description",
        content:
          "Näädän testaamien kasinoiden arvostelut jaoteltuna lisenssin mukaan: MGA, EMTA, Curaçao ja Anjouan.",
      },
    ],
  }),
  component: ArvostelutPage,
});

const GROUPS: { id: string; flag: string; title: string; blurb: string }[] = [
  { id: "mga", flag: "🇲🇹", title: "MGA-lisensoidut", blurb: "Malta Gaming Authority — verovapaat voitot, tiukka valvonta." },
  { id: "emta", flag: "🇪🇪", title: "EMTA-lisensoidut", blurb: "Viron Maksu- ja Tulliviranomainen — verovapaat voitot suomalaisille." },
  { id: "curacao", flag: "🇨🇼", title: "Curaçao-lisensoidut", blurb: "Curaçao GCB — huom: voitot ovat verotettavia suomalaisille pelaajille." },
  { id: "anjouan", flag: "🏝️", title: "Anjouan-lisensoidut", blurb: "Anjouan-lisenssi — voitot verotettavia suomalaisille pelaajille." },
];

type ReviewRow = {
  slug: string;
  name: string;
  logo_url: string | null;
  license_group: string;
};

function CasinoCard({ row }: { row: ReviewRow }) {
  return (
    <article className="bg-surface gold-border rounded-xl p-6 flex flex-col gap-5 hover:gold-glow transition-shadow min-h-[280px]">
      <div className="h-28 flex items-center justify-center bg-background/40 rounded-lg border border-[color:var(--gold)]/10 p-3">
        {row.logo_url ? (
          <img src={row.logo_url} alt={`${row.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
        ) : (
          <span className="text-xs text-muted-foreground">Ei logoa</span>
        )}
      </div>
      <h3 className="font-display text-2xl tracking-wide text-foreground">{row.name}</h3>
      <a
        href={`/arvostelut/${row.slug}`}
        className="mt-auto text-center px-4 py-3 text-sm rounded-lg font-bold uppercase tracking-wider bg-[color:var(--success)] text-background hover:opacity-90 transition-opacity"
      >
        Lue arvostelu →
      </a>
    </article>
  );
}

function ArvostelutPage() {
  const { data: rows = [] } = useQuery({
    queryKey: ["reviews-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("casino_reviews")
        .select("slug,name,logo_url,license_group")
        .eq("published", true)
        .order("display_order");
      return (data ?? []) as ReviewRow[];
    },
  });

  const byGroup = (g: string) => rows.filter((r) => r.license_group === g);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <nav className="text-xs text-muted-foreground mb-3">
          <a href="/" className="hover:text-gold">
            Etusivu
          </a>{" "}
          / Arvostelut
        </nav>
        <h1 className="font-display text-5xl mb-2">Kasinoarvostelut</h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          Näädän testaamat kasinot jaoteltuna lisenssin mukaan. Valitse kasino lukeaksesi
          täydellisen arvostelun.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {GROUPS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-3 py-1.5 rounded-full border border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"
            >
              {s.flag} {s.title} ({byGroup(s.id).length})
            </a>
          ))}
        </div>

        <div className="space-y-14">
          {GROUPS.map((s) => {
            const items = byGroup(s.id);
            if (items.length === 0) return null;
            return (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="mb-5">
                  <h2 className="font-display text-3xl text-gold">
                    {s.flag} {s.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{s.blurb}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((row) => (
                    <CasinoCard key={row.slug} row={row} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
      <CmsExtra slug="arvostelut" />
    </Layout>
  );
}
