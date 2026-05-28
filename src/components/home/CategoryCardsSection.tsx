import { Link } from "@tanstack/react-router";
import { CATEGORY_CARDS } from "./constants";

/** Kategoriakorttiruudukko. */
export function CategoryCardsSection() {
  return (
    <section id="kategoriat" className="container mx-auto px-4 py-16 border-t border-[color:var(--gold)]/15 scroll-mt-24">
      <h2 className="font-display text-4xl mb-8 text-center">Etsi kasino tarpeidesi mukaan</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORY_CARDS.map((c) => (
          <Link key={c.title} to={c.to} className="block p-6 rounded-xl bg-[#0D1B3E] border border-[color:var(--gold)]/20 hover:border-[color:var(--gold)] transition text-center group">
            <div className="text-4xl mb-3">{c.icon}</div>
            <div className="font-display text-xl text-white">{c.title}</div>
            <div className="text-xs text-foreground/60 mb-2">{c.sub}</div>
            <div className="text-sm text-gold font-semibold">→ {c.count}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}