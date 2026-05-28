import { Link } from "@tanstack/react-router";
import { CURRENT_YEAR } from "./constants";

const COLUMNS: { h: string; links: [string, string][] }[] = [
  { h: "Kasinotyypit", links: [["Kasinot ilman rekisteröitymistä", "/pikakasinot"], [`Pikakasinot ${CURRENT_YEAR}`, "/pikakasinot"], [`Uudet nettikasinot ${CURRENT_YEAR}`, "/kasinot"], ["Verovapaat kasinot", "/kasinot"], ["Nopeat kotiutukset", "/kotiutusnopeus"]] },
  { h: "Bonukset", links: [["Ilmaiskierroksia ilman talletusta", "/bonukset"], ["Talletusbonukset", "/bonukset"], ["Cashback kasinot", "/bonukset"], ["Non sticky bonukset", "/bonukset"]] },
  { h: "Maksutavat", links: [["Trustly-kasinot", "/maksutavat"], ["Brite-kasinot", "/maksutavat"], ["Zimpler-kasinot", "/maksutavat"], ["Visa-kasinot", "/maksutavat"]] },
  { h: "Oppaat", links: [["Miten valita nettikasino?", "/blogi"], ["Näädän nopeusmittari", "/kotiutusnopeus"], ["Tee valitus kasinosta", "/valitukset"], ["Kasinoiden blogi", "/blogi"]] },
];

/** Sisäisten linkkien sarakeosio. */
export function InternalLinksSection() {
  return (
    <section className="bg-surface py-16 border-t border-[color:var(--gold)]/15">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl mb-3 text-center">Tutustu myös näihin</h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">Kaikki Kasinonäädän oppaat ja vertailut yhdellä silmäyksellä</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm max-w-6xl mx-auto items-stretch">
          {COLUMNS.map((col) => (
            <div key={col.h} className="bg-background/40 gold-border rounded-xl p-5 h-full">
              <h3 className="font-display text-lg text-gold mb-4 pb-2 border-b border-[color:var(--gold)]/20">{col.h}</h3>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}><Link to={to} className="text-foreground/80 hover:text-gold transition-colors">→ {label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
