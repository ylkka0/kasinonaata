import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

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

type Section = {
  id: string;
  flag: string;
  title: string;
  blurb: string;
  casinos: string[];
};

const SECTIONS: Section[] = [
  {
    id: "mga",
    flag: "🇲🇹",
    title: "MGA-lisensoidut",
    blurb: "Malta Gaming Authority — verovapaat voitot, tiukka valvonta.",
    casinos: [
      "Tuplaus",
      "Suomikasino",
      "Munkki Kasino",
      "Mainio Kasino",
      "Tuurikasino",
      "Karhubet",
      "Huippukasino",
      "Valttikasino",
      "Kunkkukasino",
    ],
  },
  {
    id: "emta",
    flag: "🇪🇪",
    title: "EMTA-lisensoidut",
    blurb: "Viron Maksu- ja Tulliviranomainen — verovapaat voitot suomalaisille.",
    casinos: [
      "Pelikaani",
      "Pottila",
      "Bigwin",
      "Pelikioski",
      "Lapland Kasino",
      "Kassuuu",
      "Lysa Casino",
      "Pelipeto",
      "Ampparikasino",
      "Shokker",
      "Raju",
      "Jokeri",
    ],
  },
  {
    id: "curacao",
    flag: "🇨🇼",
    title: "Curaçao-lisensoidut",
    blurb: "Curaçao GCB — huom: voitot ovat verotettavia suomalaisille pelaajille.",
    casinos: [
      "Tykitys",
      "Spinnaus",
      "Taikaspinni",
      "Spiidi",
      "Panosta",
      "Tikkari",
      "Superonni",
      "Uuno Kasino",
      "Onnela Kasino",
      "Ruhtinas",
      "Jackburst",
      "Hurmio",
      "Kiekka",
      "Rullat",
      "Pelaanyt",
      "Starsplaysuomi",
      "Pikapotti",
      "Buumi",
    ],
  },
  {
    id: "anjouan",
    flag: "🏝️",
    title: "Anjouan-lisensoidut",
    blurb: "Anjouan-lisenssi — voitot verotettavia suomalaisille pelaajille.",
    casinos: ["Twin Casino", "Rizzio"],
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CasinoCard({ name }: { name: string }) {
  const slug = slugify(name);
  return (
    <article className="bg-surface gold-border rounded-xl p-4 flex flex-col gap-3 hover:gold-glow transition-shadow">
      <h3 className="font-display text-xl tracking-wide text-foreground">{name}</h3>
      <a
        href={`/arvostelut/${slug}`}
        className="mt-auto text-center px-3 py-2 text-xs rounded-lg font-bold uppercase tracking-wider bg-[color:var(--success)] text-background hover:opacity-90 transition-opacity"
      >
        Lue arvostelu →
      </a>
    </article>
  );
}

function ArvostelutPage() {
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
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-3 py-1.5 rounded-full border border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"
            >
              {s.flag} {s.title} ({s.casinos.length})
            </a>
          ))}
        </div>

        <div className="space-y-14">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <div className="mb-5">
                <h2 className="font-display text-3xl text-gold">
                  {s.flag} {s.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{s.blurb}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {s.casinos.map((name) => (
                  <CasinoCard key={name} name={name} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </Layout>
  );
}