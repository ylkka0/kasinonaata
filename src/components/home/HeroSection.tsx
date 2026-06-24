import { Link } from "@tanstack/react-router";
import { Top3HeroCards } from "./Top3HeroCards";
import heroFox from "@/assets/hero-fox.png.asset.json";
import { useT } from "@/lib/i18n";

/**
 * Etusivun yläosa: taustalla "Casino Uutiset" -näätä.
 * Vasemmalla uutismainen teaser ja oikealla kärkipaikan kortit.
 */
export function HeroSection() {
  const t = useT();
  return (
    <section
      className="relative overflow-hidden border-b border-[color:var(--gold)]/20 bg-[#0D1B3E]"
      style={{
        backgroundImage: `url(${heroFox.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center 25%",
      }}
    >
      {/* Tummennus vasemmalta oikealle, jotta teksti erottuu */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B3E]/95 via-[#0D1B3E]/75 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/80 via-transparent to-[#0D1B3E]/40 pointer-events-none" />

      <div className="container mx-auto px-4 py-10 md:py-20 relative">
        <div className="grid lg:grid-cols-[1fr_minmax(0,380px)] gap-8 md:gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="font-display text-3xl md:text-5xl leading-[1.05] text-white">
              {t("hero.kicker")} <span className="text-gold">{t("hero.headline")}</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/85">
              {t("hero.lede")}
            </p>
            <div className="mt-6">
              <Link
                to="/blogi"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[color:var(--gold)]/40 text-gold font-semibold uppercase tracking-wider text-sm hover:bg-surface bg-[#0D1B3E]/70 backdrop-blur-sm"
              >
                {t("hero.cta")}
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
