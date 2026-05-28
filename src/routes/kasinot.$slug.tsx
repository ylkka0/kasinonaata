import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/kasinot/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} arvostelu – Kasinonäätä` },
      { name: "description", content: `Näädän rehellinen arvostelu kasinosta ${params.slug}.` },
    ],
  }),
  component: Review,
});

function Review() {
  const { slug } = Route.useParams();
  const { data: c, isLoading } = useQuery({
    queryKey: ["casino", slug],
    queryFn: async () => {
      const { data } = await supabase.from("casinos").select("*").eq("slug", slug).maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading || !c) return <Layout><div className="container mx-auto px-4 py-20">Ladataan...</div></Layout>;

  const reviewLd = {
    "@context": "https://schema.org", "@type": "Review",
    itemReviewed: { "@type": "Organization", name: c.name },
    reviewRating: { "@type": "Rating", ratingValue: c.rating, bestRating: 10 },
    author: { "@type": "Organization", name: "Kasinonäätä" },
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }} />
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-gold">Etusivu</Link> / <Link to="/kasinot" className="hover:text-gold">Kasinot</Link> / {c.name}
        </nav>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-display text-5xl">{c.name}</h1>
            <p className="text-muted-foreground mt-2">{c.bonus_text}</p>
          </div>
          <div className="text-center bg-surface gold-border rounded-xl px-6 py-3">
            <div className="text-xs uppercase tracking-widest text-gold">Näädän arvio</div>
            <div className="font-display text-5xl text-gold leading-none">{Number(c.rating).toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">/ 10</div>
          </div>
        </div>

        {c.review_text && <p className="mt-6 text-lg text-foreground/90">{c.review_text}</p>}

        <a href={c.affiliate_link ?? "#"} target="_blank" rel="nofollow sponsored noopener" className="mt-6 inline-block px-6 py-3 bg-[color:var(--success)] text-background rounded-lg font-bold uppercase tracking-wider">Pelaa nyt →</a>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-surface gold-border rounded-xl p-5">
            <h2 className="font-display text-2xl text-[color:var(--success)] mb-3">Plussat</h2>
            <ul className="space-y-2 text-sm">{c.pros?.map((p, i) => <li key={i}>✓ {p}</li>)}</ul>
          </div>
          <div className="bg-surface gold-border rounded-xl p-5">
            <h2 className="font-display text-2xl text-[color:var(--danger)] mb-3">Miinukset</h2>
            <ul className="space-y-2 text-sm">{c.cons?.map((p, i) => <li key={i}>✗ {p}</li>)}</ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-surface gold-border rounded-xl p-5">
            <h3 className="font-display text-xl text-gold mb-2">Maksutavat</h3>
            <p className="text-sm">{c.payment_methods?.join(", ")}</p>
          </div>
          <div className="bg-surface gold-border rounded-xl p-5">
            <h3 className="font-display text-xl text-gold mb-2">Pelivalmistajat</h3>
            <p className="text-sm">{c.game_providers?.join(", ")}</p>
          </div>
        </div>

        {c.avg_withdrawal_minutes && (
          <div className="mt-6 bg-gradient-to-br from-[color:var(--gold)]/15 to-transparent gold-border rounded-xl p-5">
            <h3 className="font-display text-xl text-gold mb-2">⚡ Kotiutusnopeus</h3>
            <p className="text-sm">Keskimäärin <strong>{c.avg_withdrawal_minutes} min</strong> · nopein <strong>{c.fastest_withdrawal_minutes} min</strong> ({c.fastest_method})</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
