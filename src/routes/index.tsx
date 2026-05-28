import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { CURRENT_MONTH, CURRENT_YEAR } from "@/components/home/constants";
import { HeroSection } from "@/components/home/HeroSection";
import { CasinoTicker } from "@/components/home/CasinoTicker";
import { NewsFeedSection } from "@/components/home/NewsFeedSection";
import { ResponsibleGamingSection } from "@/components/home/ResponsibleGamingSection";
import { MobileStickyBar } from "@/components/home/MobileStickyBar";
import { BackToTopButton } from "@/components/home/BackToTopButton";
import { StructuredData } from "@/components/home/StructuredData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Parhaat Nettikasinot ${CURRENT_YEAR} | KasinoNäätä — Testattu Oikealla Rahalla` },
      { name: "description", content: `KasinoNäätä vertaili 50+ nettikasinoa ${CURRENT_MONTH.toLowerCase()}ssa ${CURRENT_YEAR}. Näätä tietää — sinä voitat.` },
      { name: "keywords", content: "parhaat nettikasinot 2026, pikakasinot, verovapaat kasinot, kasinobonukset, MGA-kasinot" },
      { property: "og:title", content: `Parhaat Nettikasinot ${CURRENT_YEAR} | KasinoNäätä` },
      { property: "og:description", content: "50+ testattua kasinoa, parhaat bonukset ja pikakasinot." },
      { property: "og:image", content: "/marten-logo.png" },
      { rel: "canonical", href: "https://kasinonaata.fi/" },
    ],
  }),
  component: Index,
});

/**
 * Etusivu — modulaarinen layout. Jokainen osio on oma komponenttinsa
 * src/components/home/-kansiossa. Voit pyytää muutoksia osio kerrallaan
 * (esim. "muuta HeroSection" tai "päivitä BonusesSection").
 */
function Index() {
  return (
    <Layout>
      <StructuredData />
      <HeroSection />
      <CasinoTicker />
      <NewsFeedSection />
      <ResponsibleGamingSection />
      <MobileStickyBar />
      <BackToTopButton />
    </Layout>
  );
}
