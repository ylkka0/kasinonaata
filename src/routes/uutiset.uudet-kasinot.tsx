import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { PageContent } from "@/components/PageContent";
import { loadPage, pageHead, usePage } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";

type ReviewRow = {
  slug: string;
  name: string;
  title: string;
  license: string;
  license_flag: string;
  payment_methods: string;
  welcome_bonus: string;
  withdrawals: string;
  logo_url: string | null;
  created_at: string;
};

export const Route = createFileRoute("/uutiset/uudet-kasinot")({
  loader: () => loadPage("uutiset-uudet-kasinot"),
  head: ({ loaderData }) => pageHead(loaderData, "Uudet kasinot"),
  component: UudetKasinotPage,
});

function UudetKasinotPage() {
  const { data: page } = usePage("uutiset-uudet-kasinot");
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["new-casino-reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("casino_reviews")
        .select("slug,name,title,license,license_flag,payment_methods,welcome_bonus,withdrawals,logo_url,created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      return (data ?? []) as ReviewRow[];
    },
  });

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <nav className="text-xs text-muted-foreground mb-3">
          <a href="/" className="hover:text-gold">Etusivu</a> /{" "}
          <a href="/uutiset" className="hover:text-gold">Uutiset</a> / Uudet kasinot
        </nav>
        <h1 className="font-display text-5xl mb-4">Uudet kasinot</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Uusimmat CMS:ään lisätyt ja julkaistut kasinoarvostelut yhdessä paikassa.
        </p>

        {page?.content?.trim() && (
          <div className="max-w-4xl mb-10">
            <PageContent html={page.content} />
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Ladataan...</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <NewCasinoCard key={review.slug} review={review} />
            ))}
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground py-10">Ei julkaistuja kasinoarvosteluja.</p>
        )}
      </section>
    </Layout>
  );
}

function NewCasinoCard({ review }: { review: ReviewRow }) {
  return (
    <article className="bg-surface gold-border rounded-xl p-5 flex flex-col gap-4 hover:gold-glow transition-shadow">
      <div className="h-24 flex items-center justify-center bg-background/40 rounded-lg border border-[color:var(--gold)]/10 p-3">
        {review.logo_url ? (
          <img src={review.logo_url} alt={`${review.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
        ) : (
          <span className="font-display text-2xl text-gold">{review.name.charAt(0)}</span>
        )}
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-widest text-gold mb-1">
          {review.license_flag} {review.license || "Kasinoarvostelu"}
        </div>
        <h2 className="font-display text-2xl leading-tight">{review.name}</h2>
      </div>

      {review.welcome_bonus && (
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-widest text-gold mb-1">Bonus</div>
          <p className="text-sm font-semibold line-clamp-3">{review.welcome_bonus}</p>
        </div>
      )}

      <div className="space-y-2 text-sm text-foreground/85">
        {review.payment_methods && <p><span className="text-gold">Maksutavat:</span> {review.payment_methods}</p>}
        {review.withdrawals && <p><span className="text-gold">Kotiutukset:</span> {review.withdrawals}</p>}
      </div>

      <a
        href={`/arvostelut/${review.slug}`}
        className="mt-auto text-center px-4 py-3 text-sm rounded-lg font-bold uppercase tracking-wider bg-[color:var(--success)] text-background hover:opacity-90 transition-opacity"
      >
        Lue arvostelu →
      </a>
    </article>
  );
}
