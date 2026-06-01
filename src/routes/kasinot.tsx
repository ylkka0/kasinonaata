import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { CasinoCard } from "@/components/CasinoCard";
import { CmsExtra } from "@/components/CmsExtra";

export const Route = createFileRoute("/kasinot")({
  head: () => ({
    meta: [
      { title: "Kasinot – Kasinonäätä" },
      { name: "description", content: "Kaikki testatut kasinot – Näädän testaamana." },
      { property: "og:title", content: "Kasinot – Kasinonäätä" },
      { property: "og:description", content: "Kaikki testatut kasinot" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: casinos = [] } = useQuery({
    queryKey: ["casinos-kasinot"],
    queryFn: async () => {
      let q = supabase.from("casinos").select("*").order("ranking");
      
      const { data } = await q;
      return data ?? [];
    },
  });
  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <nav className="text-xs text-muted-foreground mb-3"><a href="/" className="hover:text-gold">Etusivu</a> / Kasinot</nav>
        <h1 className="font-display text-5xl mb-2">Kasinot</h1>
        <p className="text-muted-foreground mb-8">Kaikki testatut kasinot</p>
        <div className="space-y-4 max-w-3xl">
          {casinos.map((c, i) => <CasinoCard key={c.id} casino={c} rank={i + 1} />)}
        </div>
      </section>
      <CmsExtra slug="kasinot" />
    </Layout>
  );
}
