import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { CmsExtra } from "@/components/CmsExtra";

export const Route = createFileRoute("/arvostelut")({
  head: () => ({
    meta: [
      { title: "Kasinoarvostelut – Kasinonäätä" },
      {
        name: "description",
        content: "Kaikki Näädän testaamat kasinoarvostelut yhdessä listassa.",
      },
    ],
  }),
  component: ArvostelutPage,
});

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
  const { pathname } = useLocation();
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

  if (pathname !== "/arvostelut") return <Outlet />;

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
          Kaikki Näädän testaamat kasinot samassa listassa. Valitse kasino lukeaksesi
          täydellisen arvostelun.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((row) => (
            <CasinoCard key={row.slug} row={row} />
          ))}
        </div>

        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground py-10">Ei julkaistuja arvosteluja.</p>
        )}
      </section>
      <CmsExtra slug="arvostelut" />
    </Layout>
  );
}
