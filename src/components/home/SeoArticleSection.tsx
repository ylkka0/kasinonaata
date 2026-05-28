import { CURRENT_YEAR } from "./constants";

/** Pitkä SEO-artikkeli etusivulla. */
export function SeoArticleSection() {
  return (
    <section id="seo" className="container mx-auto px-4 py-16 scroll-mt-24">
      <article className="prose prose-invert max-w-3xl mx-auto [&>h3]:mt-10 [&>h3]:mb-4 [&>p]:mb-5 [&>ul]:mb-5 [&>ol]:mb-5 [&>ul>li]:mb-1 [&>ol>li]:mb-1">
        <h2 className="font-display text-4xl text-gold leading-tight mb-6">Parhaat nettikasinot {CURRENT_YEAR} — Kasinonäädän täydellinen vertailu</h2>
        <p>Nettikasinoita on Suomessa saatavilla satoja, mutta kaikki eivät ole yhtä luotettavia. Kasinonäätä on vertaillut yli 50 nettikasinoa vuoden {CURRENT_YEAR} aikana löytääkseen parhaat vaihtoehdot suomalaisille pelaajille.</p>
        <h3 className="text-gold">Mitä tarkoittaa luotettava nettikasino?</h3>
        <p>Luotettava nettikasino tunnistaa neljästä asiasta: lisenssi, kotiutusnopeus, bonusehdot ja asiakaspalvelu. Suomalaisille tärkeimmät lisenssit ovat MGA ja EMTA.</p>
        <h3 className="text-gold">Miten valita paras nettikasino?</h3>
        <ol>
          <li>Lisenssi — MGA tai EMTA tarkoittaa verovapaita voittoja</li>
          <li>Kotiutusnopeus — testaa aina ensin pienellä summalla</li>
          <li>Kierrätysvaatimus — alle 30x on kohtuullinen</li>
          <li>Maksutavat — Trustly, Brite ja Viljo ovat nopeimmat Suomessa</li>
          <li>Asiakaspalvelu — suomenkielinen tuki on plussaa</li>
        </ol>
        <h3 className="text-gold">Vastuullinen pelaaminen</h3>
        <p>Pelaaminen on viihde, ei tulonlähde. Jos pelaaminen tuntuu pakolliselta, ota yhteyttä Peluuriin.</p>
      </article>
    </section>
  );
}