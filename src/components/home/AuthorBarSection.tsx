import martenLogo from "@/assets/marten-logo.png";
import { UPDATED_DATE_LONG } from "./constants";

/** Tekijätiedot ja päivityspäivämäärä -palkki. */
export function AuthorBarSection() {
  return (
    <section className="bg-[#0D1B3E] border-y border-[color:var(--gold)]/20 py-6">
      <div className="container mx-auto px-4 flex flex-wrap items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <img src={martenLogo} alt="" width={60} height={60} className="rounded-full gold-glow" />
          <div className="text-sm">
            <div className="font-bold text-white">Pääarvostelija: Kasinonäätä-tiimi</div>
            <div className="text-foreground/70">Päivitetty: {UPDATED_DATE_LONG}</div>
            <div className="text-foreground/70">Lukuaika: ~8 minuuttia</div>
          </div>
        </div>
        <div className="text-xs text-foreground/80 space-y-1">
          <div>✅ Tarkasti vertailtu</div>
          <div>✅ Riippumaton arviointi</div>
          <div>✅ Affiliate-ilmoitus: Sivusto saa palkkion klikkauksistasi.</div>
        </div>
      </div>
    </section>
  );
}