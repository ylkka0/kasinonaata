import { createFileRoute, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { REVIEWS } from "@/lib/casino-reviews";

export const Route = createFileRoute("/arvostelut/$slug")({
  head: ({ params }) => {
    const r = REVIEWS[params.slug];
    return {
      meta: [
        { title: r ? `${r.title} – Kasinonäätä` : "Arvostelu – Kasinonäätä" },
        {
          name: "description",
          content: r
            ? `Näädän kattava arvostelu kasinosta ${r.name}: bonukset, maksutavat, kotiutukset ja kokemukset.`
            : "Kasinoarvostelu.",
        },
      ],
    };
  },
  loader: ({ params }) => {
    if (!REVIEWS[params.slug]) throw notFound();
    return null;
  },
  notFoundComponent: () => (
    <Layout>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl mb-2">Arvostelua ei löytynyt</h1>
        <a href="/arvostelut" className="text-gold hover:underline">
          ← Takaisin arvosteluihin
        </a>
      </div>
    </Layout>
  ),
  component: ReviewPage,
});

function ReviewPage() {
  const { slug } = Route.useParams();
  const r = REVIEWS[slug];
  if (!r) return null;

  return (
    <Layout>
      <article className="container mx-auto px-4 py-10 max-w-4xl">
        <nav className="text-xs text-muted-foreground mb-4">
          <a href="/" className="hover:text-gold">
            Etusivu
          </a>{" "}
          /{" "}
          <a href="/arvostelut" className="hover:text-gold">
            Arvostelut
          </a>{" "}
          / {r.name}
        </nav>

        <header className="mb-8">
          <div className="text-xs uppercase tracking-widest text-gold mb-2">
            {r.licenseFlag} {r.license}
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            {r.title}
          </h1>
        </header>

        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <FactCard label="Lisenssi" value={`${r.licenseFlag} ${r.license}`} />
          <FactCard label="Maksutavat" value={r.paymentMethods} />
          <FactCard label="Kotiutukset" value={r.withdrawals} />
          <FactCard label="Asiakaspalvelu" value={r.support} />
        </section>

        <Block title="🎁 Tervetuliaisbonus">{r.welcomeBonus}</Block>
        <Block title="🎰 Pelivalikoima">{r.games}</Block>

        {r.extras?.map((e) => (
          <Block key={e.title} title={e.title}>
            {e.content}
          </Block>
        ))}

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-surface gold-border rounded-xl p-5">
            <h2 className="font-display text-2xl text-[color:var(--success)] mb-3">
              Plussat
            </h2>
            <ul className="space-y-2 text-sm">
              {r.pros.map((p) => (
                <li key={p}>✓ {p}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface gold-border rounded-xl p-5">
            <h2 className="font-display text-2xl text-[color:var(--danger)] mb-3">
              Miinukset
            </h2>
            <ul className="space-y-2 text-sm">
              {r.cons.map((c) => (
                <li key={c}>✗ {c}</li>
              ))}
            </ul>
          </div>
        </div>

        {r.licenseTaxNote && (
          <p className="mt-6 text-xs text-muted-foreground italic border-l-2 border-[color:var(--gold)]/40 pl-3">
            {r.licenseTaxNote}
          </p>
        )}

        <p className="mt-10 text-[10px] text-muted-foreground text-center">
          18+ · Pelaa vastuullisesti · T&amp;C voimassa
        </p>
      </article>
    </Layout>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface gold-border rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-gold mb-1">
        {label}
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface gold-border rounded-xl p-5 mb-4">
      <h2 className="font-display text-2xl text-gold mb-2">{title}</h2>
      <p className="text-sm text-foreground/90 leading-relaxed">{children}</p>
    </section>
  );
}