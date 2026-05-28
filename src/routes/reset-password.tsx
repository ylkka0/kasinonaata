import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prepareRecoverySession = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) toast.error("Palautuslinkki ei ole enää voimassa. Lähetä uusi linkki admin-sivulta.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Hash-based recovery (implicit flow): #access_token=...&type=recovery
      if (window.location.hash.includes("access_token")) {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setHasRecoverySession(!!data.session);
      setReady(true);
    };

    prepareRecoverySession();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasRecoverySession(!!session);
        setReady(true);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasRecoverySession) {
      toast.error("Avaa ensin uusin sähköpostiin tullut palautuslinkki.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      const msg = error.message || "Salasanan vaihto epäonnistui";
      if (/different|same.*password/i.test(msg)) {
        toast.error("Uuden salasanan pitää erota vanhasta.");
      } else if (/weak|short|characters|HIBP|pwned/i.test(msg)) {
        toast.error("Salasana on liian heikko. Käytä pidempää ja vahvempaa salasanaa.");
      } else {
        toast.error(msg);
      }
      return;
    }

    toast.success("Salasana vaihdettu. Voit kirjautua adminiin uudella salasanalla.");
    setPassword("");
  };

  return (
    <Layout>
      <section className="container mx-auto max-w-sm px-4 py-16">
        <h1 className="font-display text-4xl mb-2">Vaihda salasana</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Avaa sähköpostiin tullut palautuslinkki ja aseta uusi salasana tässä näkymässä.
        </p>
        {ready && !hasRecoverySession && (
          <div className="mb-4 rounded border border-[color:var(--gold)]/30 bg-surface p-3 text-xs text-muted-foreground">
            Salasanan vaihtoa varten tarvitaan sähköpostin palautuslinkki. Jos linkki on vanhentunut, lähetä uusi admin-sivulta.
          </div>
        )}
        <form onSubmit={updatePassword} className="space-y-3">
          <input
            type="password"
            required
            minLength={6}
            placeholder="Uusi salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          />
          <button disabled={submitting || !ready || !hasRecoverySession} className="w-full px-4 py-2.5 gradient-gold text-background font-bold uppercase rounded disabled:opacity-60 disabled:cursor-not-allowed">
            {!ready ? "Tarkistetaan linkkiä..." : submitting ? "Hetki..." : "Tallenna uusi salasana"}
          </button>
          <Link to="/admin" className="block text-center text-xs text-muted-foreground hover:text-gold">
            Takaisin admin-kirjautumiseen
          </Link>
        </form>
      </section>
    </Layout>
  );
}