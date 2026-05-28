import { Info } from "lucide-react";

export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-2 border-l-4 border-[color:var(--gold)] bg-[color:var(--gold)]/10 px-3 ${compact ? "py-1.5 text-[11px]" : "py-2 text-xs"} text-foreground/80`}>
      <Info className="w-3.5 h-3.5 mt-0.5 text-gold shrink-0" />
      <p>
        <strong className="text-gold">Kumppanuusmarkkinointi:</strong> Osa linkeistä on affiliate-linkkejä. Saat kasinolta saman tarjouksen riippumatta siitä, käytätkö linkkiämme. Tämä ei vaikuta arvostelujemme objektiivisuuteen.
      </p>
    </div>
  );
}