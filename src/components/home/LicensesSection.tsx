import { Link } from "@tanstack/react-router";

const LICENSES = [
  { flag: "🟢", title: "MGA-lisenssi", sub: "Malta Gaming Authority", items: ["✅ Verovapaat voitot", "✅ Tiukka valvonta", "✅ Pelaajan suoja"], cta: "31 MGA-kasinoa →" },
  { flag: "🟢", title: "Viron EMTA-lisenssi", sub: "Eesti Maksu- ja Tolliamet", items: ["✅ Verovapaat voitot", "✅ Tiukka valvonta", "✅ Suomalaiset pelisäännöt"], cta: "18 EMTA-kasinoa →" },
  { flag: "🟡", title: "Curacaon lisenssi", sub: "Curacao eGaming", items: ["❌ Verotettavat voitot", "⚠️ Löysempi valvonta", "⚠️ Vähemmän pelaajan suojaa"], cta: "Curacaon kasinot →" },
] as const;

/** Lisenssityypit -kortit. */
export function LicensesSection() {
  return (
    <section id="lisenssit" className="container mx-auto px-4 py-16 border-t border-[color:var(--gold)]/15 scroll-mt-24">
      <h2 className="font-display text-4xl mb-8 text-center">Kasinon lisenssi — miksi se on tärkeä?</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {LICENSES.map((l) => (
          <div key={l.title} className="bg-surface gold-border rounded-xl p-6">
            <div className="text-3xl mb-2">{l.flag}</div>
            <div className="font-display text-2xl text-gold">{l.title}</div>
            <div className="text-xs text-muted-foreground mb-4">{l.sub}</div>
            <ul className="space-y-1.5 text-sm mb-4">{l.items.map((i) => <li key={i}>{i}</li>)}</ul>
            <Link to="/kasinot" className="text-sm text-gold hover:underline">{l.cta}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}