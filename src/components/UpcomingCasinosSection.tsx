import { useMemo, useState } from "react";

export type UpcomingCasino = {
  /** Unique slug (used as React key + review link) */
  slug: string;
  name: string;
  /** Plain text date label, e.g. "Toukokuu 2026" */
  launchLabel: string;
  /** ISO-ish month bucket for filtering: "2026-05" | "2026-06" | "2026-07+" */
  launchBucket: "2026-05" | "2026-06" | "2026-07+";
  /** Optional precise date for the corner badge, e.g. "5.6." */
  estDate?: string;
  justLaunched?: boolean;
  license: "Malta" | "Estonia" | "Curaçao" | "Anjouan";
  bonus: string;
  /** 2–3 short feature chips */
  features: string[];
  /** Tag flags for filtering */
  tags?: ("paynplay" | "cashback")[];
  /** Optional logo URL (placeholder used otherwise) */
  logoUrl?: string;
  affiliateUrl?: string;
  reviewUrl?: string;
};

const LICENSE_META: Record<
  UpcomingCasino["license"],
  { flag: string; label: string }
> = {
  Malta: { flag: "🇲🇹", label: "Malta (MGA)" },
  Estonia: { flag: "🇪🇪", label: "Viro (EMTA)" },
  "Curaçao": { flag: "🇨🇼", label: "Curaçao" },
  Anjouan: { flag: "🏝️", label: "Anjouan" },
};

export const UPCOMING_CASINOS: UpcomingCasino[] = [
  {
    slug: "superonni",
    name: "SuperOnni",
    launchLabel: "Toukokuu 2026",
    launchBucket: "2026-05",
    justLaunched: true,
    license: "Estonia",
    bonus: "20 Mega Spinia + 20% cashback",
    features: ["Pay N Play", "Zimpler", "Nopeat kotiutukset"],
    tags: ["paynplay", "cashback"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/superonni",
  },
  {
    slug: "tikkari",
    name: "Tikkari Casino",
    launchLabel: "Toukokuu 2026",
    launchBucket: "2026-05",
    justLaunched: true,
    license: "Estonia",
    bonus: "15% päivittäinen cashback",
    features: ["Pay N Play", "Brite", "Verovapaa"],
    tags: ["paynplay", "cashback"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/tikkari",
  },
  {
    slug: "taika-spinni",
    name: "Taika Spinni",
    launchLabel: "Toukokuu 2026",
    launchBucket: "2026-05",
    estDate: "22.5.",
    license: "Estonia",
    bonus: "Taikapyörä jopa 5 000 €",
    features: ["Pay N Play", "Zimpler", "Verovapaa"],
    tags: ["paynplay"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/taikaspinni",
  },
  {
    slug: "munkki",
    name: "Munkki Casino",
    launchLabel: "Toukokuu 2026",
    launchBucket: "2026-05",
    estDate: "28.5.",
    license: "Malta",
    bonus: "125% / 600 € + ilmaiskierroksia",
    features: ["Trustly", "Zimpler", "6000+ peliä"],
    tags: ["paynplay"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/munkki-kasino",
  },
  {
    slug: "spiidi",
    name: "Spiidi Casino",
    launchLabel: "Toukokuu 2026",
    launchBucket: "2026-05",
    estDate: "30.5.",
    license: "Estonia",
    bonus: "100 FS + 10% cashback",
    features: ["Pay N Play", "Zimpler", "Nopeat kotiutukset"],
    tags: ["paynplay", "cashback"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/spiidi",
  },
  {
    slug: "blingi",
    name: "Blingi",
    launchLabel: "Kesäkuu 2026",
    launchBucket: "2026-06",
    estDate: "5.6.",
    license: "Malta",
    bonus: "250 ilmaiskierrosta + 20% cashback",
    features: ["Rootz-alusta", "Trustly", "Verovapaa"],
    tags: ["cashback"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/blingi",
  },
  {
    slug: "kasarmi",
    name: "Kasarmi",
    launchLabel: "Kesäkuu 2026",
    launchBucket: "2026-06",
    estDate: "12.6.",
    license: "Estonia",
    bonus: "Cashback-painotteinen tervetulopaketti",
    features: ["Pay N Play", "Zimpler", "Verovapaa"],
    tags: ["paynplay", "cashback"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/kasarmi",
  },
  {
    slug: "quickz",
    name: "Quickz",
    launchLabel: "Kesäkuu 2026",
    launchBucket: "2026-06",
    estDate: "20.6.",
    license: "Estonia",
    bonus: "200 FS ensitalletuksella",
    features: ["Pay N Play", "Brite", "Nopeat kotiutukset"],
    tags: ["paynplay"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/quickz",
  },
  {
    slug: "slotser",
    name: "Slotser",
    launchLabel: "Heinäkuu 2026",
    launchBucket: "2026-07+",
    estDate: "3.7.",
    license: "Malta",
    bonus: "100% / 500 € + 150 FS",
    features: ["Trustly", "Zimpler", "VIP-ohjelma"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/slotser",
  },
  {
    slug: "spinpurple",
    name: "SpinPurple",
    launchLabel: "Heinäkuu 2026",
    launchBucket: "2026-07+",
    estDate: "15.7.",
    license: "Estonia",
    bonus: "10% viikoittainen cashback",
    features: ["Pay N Play", "Zimpler", "Verovapaa"],
    tags: ["paynplay", "cashback"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/spinpurple",
  },
  {
    slug: "voittoo",
    name: "Voittoo.com",
    launchLabel: "Heinäkuu 2026",
    launchBucket: "2026-07+",
    estDate: "25.7.",
    license: "Estonia",
    bonus: "20 ilmaiskierrosta ilman talletusta",
    features: ["Pay N Play", "Brite", "Verovapaa"],
    tags: ["paynplay"],
    affiliateUrl: "#",
    reviewUrl: "/arvostelut/voittoo",
  },
];

type FilterId =
  | "all"
  | "2026-05"
  | "2026-06"
  | "2026-07+"
  | "Estonia"
  | "Malta"
  | "paynplay"
  | "cashback";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Kaikki" },
  { id: "2026-05", label: "Toukokuu 2026" },
  { id: "2026-06", label: "Kesäkuu 2026" },
  { id: "2026-07+", label: "Heinäkuu+" },
  { id: "Estonia", label: "Viron lisenssi" },
  { id: "Malta", label: "Malta-lisenssi" },
  { id: "paynplay", label: "Pay N Play" },
  { id: "cashback", label: "Cashback" },
];

type Props = {
  casinos?: UpcomingCasino[];
  lastUpdated?: string;
};

export function UpcomingCasinosSection({
  casinos = UPCOMING_CASINOS,
  lastUpdated = "22.5.2026",
}: Props) {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return casinos;
    if (filter === "2026-05" || filter === "2026-06" || filter === "2026-07+")
      return casinos.filter((c) => c.launchBucket === filter);
    if (filter === "Estonia" || filter === "Malta")
      return casinos.filter((c) => c.license === filter);
    return casinos.filter((c) => c.tags?.includes(filter));
  }, [filter, casinos]);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Top area */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">
            Tulossa olevat uudet kasinot 2026
          </h2>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
            Katso uusimmat suomalaispelaajille suunnatut nettikasinot — bonukset,
            lanseerauspäivät ja lisenssit yhdessä paikassa.
          </p>
        </div>
        <span className="self-start md:self-auto shrink-0 text-[10px] uppercase tracking-widest text-gold border border-[color:var(--gold)]/40 rounded-full px-3 py-1">
          Päivitetty: {lastUpdated}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1 scrollbar-thin">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "bg-gold text-background border-[color:var(--gold)]"
                  : "border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <UpcomingCard key={c.slug} casino={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-10">
          Ei kasinoita tällä suodattimella.
        </p>
      )}

      <p className="text-xs text-muted-foreground mt-8 italic max-w-3xl">
        Lanseerauspäivät ovat arvioita saatavilla olevien lähteiden perusteella ja
        saattavat muuttua.
      </p>
    </section>
  );
}

function UpcomingCard({ casino }: { casino: UpcomingCasino }) {
  const lic = LICENSE_META[casino.license];
  const cornerBadge = casino.justLaunched
    ? "Juuri lanseerattu"
    : casino.estDate
      ? `Arvioitu ${casino.estDate}`
      : casino.launchLabel;

  return (
    <article className="relative bg-surface gold-border rounded-xl p-5 flex flex-col gap-3 hover:gold-glow transition-shadow">
      {/* Corner badge */}
      <span className="absolute -top-2 left-4 text-[10px] uppercase tracking-widest bg-gold text-background rounded-full px-2 py-0.5 font-bold">
        {cornerBadge}
      </span>

      {/* Logo + name */}
      <div className="flex items-center gap-3 mt-2">
        <div className="size-14 shrink-0 rounded-lg bg-surface-2 border border-[color:var(--gold)]/30 flex items-center justify-center overflow-hidden">
          {casino.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={casino.logoUrl}
              alt={`${casino.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-xl text-gold">
              {casino.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight truncate">
            {casino.name}
          </h3>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">
            <span className="mr-1">{lic.flag}</span>
            <span className="text-gold">{lic.label}</span>
          </div>
        </div>
      </div>

      {/* Bonus highlight */}
      <div className="bg-surface-2 border border-[color:var(--gold)]/20 rounded-lg px-3 py-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
          Bonus
        </div>
        <div className="text-sm font-semibold text-foreground">{casino.bonus}</div>
      </div>

      {/* Features */}
      <ul className="flex flex-wrap gap-1.5">
        {casino.features.map((f) => (
          <li
            key={f}
            className="text-[11px] px-2 py-0.5 rounded-full border border-[color:var(--gold)]/30 text-foreground/80"
          >
            ✓ {f}
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className="mt-auto pt-2 flex items-center gap-3">
        <a
          href={casino.affiliateUrl ?? "#"}
          target="_blank"
          rel="nofollow noopener sponsored"
          className="flex-1 text-center px-3 py-2 text-xs rounded-lg font-bold uppercase tracking-wider bg-[color:var(--success)] text-background hover:opacity-90 transition-opacity"
        >
          Pelaa nyt →
        </a>
        {casino.reviewUrl && (
          <a
            href={casino.reviewUrl}
            className="text-xs text-gold hover:underline whitespace-nowrap"
          >
            Lue arvostelu
          </a>
        )}
      </div>
    </article>
  );
}