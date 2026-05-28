import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Aktiiviset bonus-hälytykset (banneri). */
export function BonusAlertsSection() {
  const { data: alerts = [] } = useQuery({
    queryKey: ["bonus-alerts"],
    queryFn: async () => {
      const { data } = await supabase.from("bonus_alerts").select("*").eq("active", true).limit(3);
      return data ?? [];
    },
  });
  if (alerts.length === 0) return null;
  return (
    <section className="container mx-auto px-4 mt-8 space-y-3">
      {alerts.map((a) => (
        <div key={a.id} className="bg-gradient-to-r from-[color:var(--gold)]/15 to-transparent border border-[color:var(--gold)]/40 rounded-lg p-4 flex items-center gap-4">
          <span className="text-2xl">⚡</span>
          <div className="flex-1">
            <div className="font-bold text-gold">{a.title}</div>
            {a.description && <div className="text-sm text-muted-foreground">{a.description}</div>}
          </div>
          {a.affiliate_link && (
            <a href={a.affiliate_link} target="_blank" rel="nofollow sponsored noopener" className="px-4 py-2 bg-[color:var(--success)] text-background rounded-md text-sm font-bold uppercase">Lunasta</a>
          )}
        </div>
      ))}
    </section>
  );
}