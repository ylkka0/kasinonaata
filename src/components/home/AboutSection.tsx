import martenLogo from "@/assets/marten-logo.png";

/** "Kuka on Kasinonäätä?" -esittely. */
export function AboutSection() {
  return (
    <section id="tietoa" className="container mx-auto px-4 py-16 border-t border-[color:var(--gold)]/15 scroll-mt-24">
      <div className="grid md:grid-cols-[250px_1fr] gap-10 items-center">
        <img src={martenLogo} alt="Kasinonäätä" className="rounded-full gold-glow w-full max-w-[250px] mx-auto" />
        <div>
          <h2 className="font-display text-4xl text-gold mb-4">Kuka on Kasinonäätä?</h2>
          <p className="text-foreground/85 mb-3">Kasinonäätä on suomalaisten pelaajien puolella oleva vertailusivusto.</p>
          <p className="text-muted-foreground mb-6">Listaamme vain kasinot, jotka kestävät kriittisen tarkastelun.</p>
          <div className="flex flex-wrap gap-3">
            {["✅ Tarkasti vertailtu", "🛡️ Vain lisensoidut", "📅 Päivitetty viikoittain"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-surface gold-border text-sm font-semibold text-gold">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}