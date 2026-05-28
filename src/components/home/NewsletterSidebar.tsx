import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/** Uutiskirjetilauslomake sivupalkkiin. */
export function NewsletterSidebar() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setSubscribing(false);
    if (error) {
      if (error.code === "23505") toast.error("Olet jo tilaajalistalla");
      else toast.error(error.message);
      return;
    }
    toast.success("Kiitos! Olet nyt tilaajalistalla.");
    setEmail("");
  };

  return (
    <div className="bg-surface gold-border rounded-xl overflow-hidden">
      <div className="bg-[color:var(--gold)]/10 px-5 py-3 border-b border-[color:var(--gold)]/30">
        <h3 className="font-display text-xl text-gold">Uutiskirje</h3>
      </div>
      <form onSubmit={subscribe} className="p-5 space-y-3">
        <p className="text-xs text-muted-foreground">Saat parhaat bonukset ja Näädän vinkit suoraan sähköpostiin.</p>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--gold)]"
          placeholder="sinun@sahkoposti.fi" />
        <button type="submit" disabled={subscribing} className="w-full px-4 py-2.5 gradient-gold text-background font-bold uppercase tracking-wider rounded text-sm disabled:opacity-60">
          {subscribing ? "Lähetetään..." : "Tilaa uutiskirje"}
        </button>
      </form>
    </div>
  );
}