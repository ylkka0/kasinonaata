/** 18+ vastuullisen pelaamisen palkki. */
export function ResponsibleGamingSection() {
  return (
    <section className="bg-[#1A3A5C] py-6 border-t border-[color:var(--gold)]/20">
      <div className="container mx-auto px-4 flex flex-wrap items-center gap-4 justify-center text-center text-sm text-white">
        <span className="inline-block px-3 py-1 border-2 border-[color:var(--gold)] rounded font-display text-gold">🛡️ 18+</span>
        <span>Pelaa vastuullisesti. Rahapelaaminen voi aiheuttaa riippuvuutta.</span>
        <span>Apua saat: <a href="https://www.peluuri.fi" target="_blank" rel="noreferrer noopener" className="text-gold hover:underline">peluuri.fi</a> | 0800 100 101</span>
      </div>
    </section>
  );
}