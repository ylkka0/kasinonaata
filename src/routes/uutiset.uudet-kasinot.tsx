import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { loadPage, pageHead } from "@/lib/cms";
import { UpcomingCasinosSection } from "@/components/UpcomingCasinosSection";

type Launch = {
  name: string;
  date?: string;
  license?: string;
  market?: string;
  description: string;
  angle?: string;
  source?: string;
};

type Section = {
  id: string;
  title: string;
  subtitle?: string;
  launches: Launch[];
};

const HEADER = {
  updated: "Päivitetty: 19. toukokuuta 2026",
  intro:
    "Vahvistettuja uusia brändi- ja markkinalanseerauksia alan lehdistöstä — fokuksessa Suomeen suuntautuvat MGA-, EMTA- ja Curaçao-lisensoidut kasinot.",
};

const SECTIONS: Section[] = [
  {
    id: "mga-finnish",
    title: "🇲🇹 MGA-lisensoidut, suomalaisille suunnatut",
    launches: [
      {
        name: "ZenoBet Casino",
        date: "Maaliskuu 2026",
        license: "MGA",
        description:
          "Hybridi kasino (slotit + vedonlyönti), Zimpler-maksut, ei kierrätysvaatimusta: 75 cash spinia Gates of Olympus + 75 Sweet Bonanzalla kahdella ensimmäisellä talletuksella.",
      },
      {
        name: "PlayZee Casino",
        date: "Alkuvuosi 2026",
        license: "MGA",
        description:
          "Sisarbrändi Casiku Casinolle. Perinteinen rekisteröinti, Trustly + useita maksuvaihtoehtoja.",
      },
      {
        name: "Casiku Casino",
        license: "MGA",
        description: "Uusi MGA-lanseeraus. Zimpler pikakasino, suomenkielinen, välittömät kotiutukset.",
      },
      {
        name: "Tykitys Kasino",
        date: "Tammikuu 2026",
        license: "MGA",
        description:
          "Fruity Partnersin operoima (myös Kaahaus ja Spinnaus). Brite-maksut, päivittäinen cashback jopa 20%.",
      },
      {
        name: "Pottila Kasino",
        license: "MGA",
        description:
          "Tuore lanseeraus, sisarbrändi Pelikaanille ja Pelikioskille. 100 kierrätysvapaata pyöräytystä tervetuliaisbonuksena.",
      },
      {
        name: "Karhubet Casino",
        date: "2025",
        license: "MGA",
        description:
          "White Hat Gaming, 3 500+ peliä, Zimpler pikakasino, 4-tason VIP.",
      },
      {
        name: "Vauhdikas Casino",
        license: "MGA",
        description: "BP Group -operaattori (sisarbrändit: Nitro, Rapid Casino).",
      },
      {
        name: "Munkki Kasino",
        license: "MGA",
        description: "White Hat Gaming. Ei rekisteröitymistä, 6 000+ peliä, Zimplerin välittömät kotiutukset.",
      },
    ],
  },
  {
    id: "emta-finnish",
    title: "🇪🇪 Viron EMTA-lisenssi, suomalaisille suunnatut",
    launches: [
      {
        name: "Lysa Casino",
        license: "EMTA",
        description:
          "Ei rekisteröitymistä suomalaisilla pankkitunnuksilla, 200% non-sticky bonus jopa 1 000 €, ~15 min kotiutukset.",
      },
      {
        name: "Shotz Casino",
        date: "Lanseerattu 2024, aktiivinen 2026",
        license: "EMTA",
        description: "Virolainen lisenssi. Pikakasino, tuhansia slotteja + live kasino.",
      },
    ],
  },
  {
    id: "curacao-finnish",
    title: "🇨🇼 Curaçao GCB-lisenssi, suomalaisille suunnatut",
    subtitle:
      "Huom: Curaçao-lisensoiduilla kasinoilla voitot ovat verotettavia suomalaisille pelaajille, toisin kuin MGA/EMTA-kasinoilla.",
    launches: [
      {
        name: "Berriez Casino",
        date: "Loppuvuosi 2025",
        license: "Curaçao GCB",
        description:
          "Suomenkielinen, Trumo-maksut, välittömät kotiutukset, 365 ilmaispyöräytystä 20 €+ talletuksella.",
      },
      {
        name: "Lucky Froots",
        date: "Loppuvuosi 2025",
        license: "Curaçao GCB",
        description: "BetPoint Groupin uusi brändi, ei rekisteröitymistä, suomenkielinen.",
      },
    ],
  },
];

export const Route = createFileRoute("/uutiset/uudet-kasinot")({
  loader: () => loadPage("uutiset-uudet-kasinot"),
  head: ({ loaderData }) => pageHead(loaderData, "Uudet kasinot"),
  component: UudetKasinotPage,
});

function UudetKasinotPage() {
  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <nav className="text-xs text-muted-foreground mb-3">
          <a href="/" className="hover:text-gold">Etusivu</a> /{" "}
          <a href="/uutiset" className="hover:text-gold">Uutiset</a> / Uudet kasinot
        </nav>
        <h1 className="font-display text-5xl mb-2">Uudet kasinot</h1>
        <p className="text-sm uppercase tracking-widest text-gold mb-8">
          {HEADER.updated}
        </p>

        {/* Header card */}
        <div className="max-w-4xl bg-surface gold-border rounded-xl p-6 mb-10">
          <p className="text-foreground/90 leading-relaxed">{HEADER.intro}</p>
        </div>

        {/* Upcoming launches (filterable cards) */}
        <UpcomingCasinosSection />

        {/* Sections */}
        <div className="space-y-12 max-w-6xl">
          {SECTIONS.map((section) => (
            <section key={section.id}>
              <h2 className="font-display text-3xl text-gold mb-2">{section.title}</h2>
              {section.subtitle && (
                <p className="text-sm text-muted-foreground mb-5 max-w-3xl">{section.subtitle}</p>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                {section.launches.map((l) => (
                  <article
                    key={l.name}
                    className="bg-surface gold-border rounded-xl p-5 hover:gold-glow transition-shadow flex flex-col"
                  >
                    <header className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-xl leading-tight">{l.name}</h3>
                      {l.date && (
                        <span className="shrink-0 text-[10px] uppercase tracking-widest text-gold border border-[color:var(--gold)]/40 rounded-full px-2 py-0.5">
                          {l.date}
                        </span>
                      )}
                    </header>
                    {l.license && (
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                        Lisenssi: <span className="text-gold">{l.license}</span>
                      </div>
                    )}
                    <p className="text-sm text-foreground/90 leading-relaxed">{l.description}</p>
                    {l.angle && (
                      <div className="mt-3 pt-3 border-t border-[color:var(--gold)]/20">
                        <div className="text-[10px] uppercase tracking-widest text-gold mb-1">Kulma</div>
                        <p className="text-sm italic text-muted-foreground">{l.angle}</p>
                      </div>
                    )}
                    {l.source && (
                      <div className="mt-3 text-[11px] text-muted-foreground">
                        Lähde: <span className="text-foreground/80">{l.source}</span>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </Layout>
  );
}