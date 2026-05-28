import martenLogo from "@/assets/marten-logo.png";

/** "Näätä sanoo" -sitaattilaatikko sivupalkkiin. */
export function NaataQuoteSidebar() {
  return (
    <div className="bg-surface gold-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <img src={martenLogo} alt="" width={48} height={48} className="rounded-full" />
        <h3 className="font-display text-xl text-gold">Näätä sanoo</h3>
      </div>
      <p className="text-sm text-muted-foreground italic">"Älä koskaan pelaa kasinolla joka ei kerro kotiutusaikaansa. Jos he piilottavat sen, siihen on syy."</p>
    </div>
  );
}