import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { pick, pickArr, useLang, useT } from "@/lib/i18n";

type Extra = { title: string; content: string };
type Review = {
  slug: string;
  name: string;
  title: string;
  license: string;
  license_flag: string;
  license_tax_note: string | null;
  payment_methods: string;
  welcome_bonus: string;
  games: string;
  withdrawals: string;
  support: string;
  logo_url: string | null;
  extras: Extra[];
  pros: string[];
  cons: string[];
  title_en?: string | null;
  welcome_bonus_en?: string | null;
  games_en?: string | null;
  withdrawals_en?: string | null;
  support_en?: string | null;
  payment_methods_en?: string | null;
  pros_en?: string[] | null;
  cons_en?: string[] | null;
  extras_en?: Extra[] | null;
};

export const Route = createFileRoute("/arvostelut/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} – Kasinonäätä` },
      { name: "description", content: "Näädän kasinoarvostelu." },
    ],
  }),
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
  const { lang } = useLang();
  const t = useT();
  const { data: r, isLoading } = useQuery({
    queryKey: ["review", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("casino_reviews")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return data as unknown as Review | null;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">{t("common.loading")}</div>
      </Layout>
    );
  }

  if (!r) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl mb-2">{t("review.notFound")}</h1>
          <a href="/arvostelut" className="text-gold hover:underline">{t("review.backToList")}</a>
        </div>
      </Layout>
    );
  }

  const title = pick(lang, r.title, r.title_en);
  const welcomeBonus = pick(lang, r.welcome_bonus, r.welcome_bonus_en);
  const games = pick(lang, r.games, r.games_en);
  const withdrawals = pick(lang, r.withdrawals, r.withdrawals_en);
  const support = pick(lang, r.support, r.support_en);
  const payments = pick(lang, r.payment_methods, r.payment_methods_en);
  const pros = pickArr(lang, r.pros, r.pros_en);
  const cons = pickArr(lang, r.cons, r.cons_en);
  const extras: Extra[] = (lang === "en" && r.extras_en && r.extras_en.length > 0 ? r.extras_en : (r.extras ?? []));

  return (
    <Layout>
      <article className="container mx-auto px-4 py-10 max-w-4xl">
        <nav className="text-xs text-muted-foreground mb-4">
          <a href="/" className="hover:text-gold">
            {t("common.home")}
          </a>{" "}
          /{" "}
          <a href="/arvostelut" className="hover:text-gold">
            {t("review.crumb")}
          </a>{" "}
          / {r.name}
        </nav>

        <header className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
          {r.logo_url && (
            <div className="w-32 h-32 shrink-0 bg-surface gold-border rounded-xl p-3 flex items-center justify-center">
              <img src={r.logo_url} alt={`${r.name} logo`} className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <div>
            <div className="text-xs uppercase tracking-widest text-gold mb-2">
              {r.license_flag} {r.license}
            </div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">
              {title}
            </h1>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <FactCard label={t("review.license")} value={`${r.license_flag} ${r.license}`} />
          <FactCard label={t("review.payments")} value={payments ?? ""} />
          <FactCard label={t("review.withdrawals")} value={withdrawals ?? ""} />
          <FactCard label={t("review.support")} value={support ?? ""} />
        </section>

        <Block title={t("review.bonus")}>{welcomeBonus}</Block>
        <Block title={t("review.games")}>{games}</Block>

        {extras.map((e) => (
          <Block key={e.title} title={e.title}>
            {e.content}
          </Block>
        ))}

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-surface gold-border rounded-xl p-5">
            <h2 className="font-display text-2xl text-[color:var(--success)] mb-3">
              {t("review.pros")}
            </h2>
            <ul className="space-y-2 text-sm">
              {pros.map((p) => (
                <li key={p}>✓ {p}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface gold-border rounded-xl p-5">
            <h2 className="font-display text-2xl text-[color:var(--danger)] mb-3">
              {t("review.cons")}
            </h2>
            <ul className="space-y-2 text-sm">
              {cons.map((c) => (
                <li key={c}>✗ {c}</li>
              ))}
            </ul>
          </div>
        </div>

        {r.license_tax_note && (
          <p className="mt-6 text-xs text-muted-foreground italic border-l-2 border-[color:var(--gold)]/40 pl-3">
            {r.license_tax_note}
          </p>
        )}

        <p className="mt-10 text-[10px] text-muted-foreground text-center">
          {t("review.disclaimer")}
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