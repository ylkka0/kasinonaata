import { Link } from "@tanstack/react-router";
import { Top3HeroCards } from "./Top3HeroCards";

/**
 * Etusivun yläosa: vasemmalla uutismainen teaser, keskellä iso näätä-maskotti.
 * Kaikki vanha otsikko/CTA-sisältö on poistettu.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--gold)]/20 bg-[#0D1B3E]">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.25),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 md:py-16 relative">
        <div className="grid lg:grid-cols-[1fr_minmax(0,460px)] gap-8 md:gap-10 items-center">
          <div className="max-w-xl">
            <h1 className="font-display text-3xl md:text-5xl leading-[1.05] text-white">
              Kasinouutiset — <span className="text-gold">aina ajan tasalla</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-foreground/85">
              Kasinonäätä seuraa nettikasinoiden maailmaa kellon ympäri.
              Uudet kasinot, bonusmuutokset, lisenssipäivitykset —
              saat kaiken täältä ensimmäisenä.
            </p>
            <div className="mt-6">
              <Link to="/blogi" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[color:var(--gold)]/40 text-gold font-semibold uppercase tracking-wider text-sm hover:bg-surface bg-[#0D1B3E]/70">
                Lue uutiset →
              </Link>
            </div>
          </div>

          <div className="relative">
            <Top3HeroCards />
          </div>
        </div>
      </div>
    </section>
  );
}