import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { AuthorBox } from "@/components/AuthorBox";
import martenLogo from "@/assets/marten-logo.png";
import { usePage } from "@/lib/cms";
import { PageContent } from "@/components/PageContent";

export const Route = createFileRoute("/valitukset")({
  head: () => ({
    meta: [
      { title: "Valitukset – Onko kasinosi kieltäytynyt maksamasta? | Kasinonäätä" },
      { name: "description", content: "Lähetä kasinovalitus Kasinonäädälle. Autamme suomalaisia pelaajia saamaan rahat takaisin kasinoilta. Julkinen valitustietokanta ja ratkaisutilastot." },
      { property: "og:title", content: "Kasinovalitukset – Saa rahasi takaisin" },
      { property: "og:description", content: "Suomen ainoa avoin kasinovalitustietokanta. Näätä auttaa." },
      { rel: "canonical", href: "https://kasinonaata.fi/valitukset" },
    ],
  }),
  component: ValituksetPage,
});

const ISSUE_LABELS: Record<string, string> = {
  no_payment: "Kasino kieltäytyy maksamasta",
  account_closed: "Tili suljettu perustelematta",
  bonus_issue: "Bonus-ongelma",
  technical: "Tekninen ongelma",
  other: "Muu ongelma",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "🟡 Odottaa", color: "text-warning" },
  in_progress: { label: "🟡 Käsittelyssä", color: "text-warning" },
  resolved: { label: "✅ Ratkaistu", color: "text-[color:var(--success)]" },
  rejected: { label: "❌ Hylätty", color: "text-muted-foreground" },
  unresolved: { label: "🔴 Ratkaisematon", color: "text-destructive" },
};

const schema = z.object({
  display_name: z.string().trim().min(1, "Nimi vaaditaan").max(80),
  email: z.string().trim().email("Anna kelvollinen sähköposti").max(200),
  casino_name: z.string().trim().min(1, "Kasinon nimi vaaditaan").max(120),
  issue_type: z.enum(["no_payment", "account_closed", "bonus_issue", "technical", "other"]),
  description: z.string().trim().min(50, "Vähintään 50 merkkiä").max(5000),
  amount_eur: z.number().positive().max(1_000_000).optional(),
});

function ValituksetPage() {
  const qc = useQueryClient();
  const { data: cmsPage } = usePage("valitukset");
  const [form, setForm] = useState({
    display_name: "",
    email: "",
    casino_name: "",
    issue_type: "no_payment" as const,
    description: "",
    amount_eur: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: complaints = [] } = useQuery({
    queryKey: ["complaints-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("id, created_at, casino_name, issue_type, amount_eur, status, resolution_notes")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse({
        ...form,
        amount_eur: form.amount_eur ? Number(form.amount_eur) : undefined,
      });
      const { error } = await supabase.from("complaints").insert({
        display_name: parsed.display_name,
        email: parsed.email,
        casino_name: parsed.casino_name,
        issue_type: parsed.issue_type,
        description: parsed.description,
        amount_eur: parsed.amount_eur ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      setForm({ display_name: "", email: "", casino_name: "", issue_type: "no_payment", description: "", amount_eur: "" });
      qc.invalidateQueries({ queryKey: ["complaints-public"] });
    },
    onError: (e: unknown) => {
      if (e instanceof z.ZodError) {
        setError(e.errors[0]?.message ?? "Tarkista tiedot");
      } else {
        setError(e instanceof Error ? e.message : "Lähetys epäonnistui");
      }
    },
  });

  const totalProcessed = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const resolvedPct = totalProcessed > 0 ? Math.round((resolved / totalProcessed) * 100) : 0;
  const totalRecovered = complaints
    .filter((c) => c.status === "resolved")
    .reduce((acc, c) => acc + (Number(c.amount_eur) || 0), 0);

  return (
    <Layout>
      <section className="relative border-b border-[color:var(--gold)]/20 overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,76,0.4),transparent_60%)]" />
        <div className="container mx-auto px-4 py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--gold)]/40 text-xs uppercase tracking-widest text-gold mb-4">
              ⚖ Kasinonäädän valituspalvelu
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.95]">
              Onko kasinosi kieltäytynyt<br /><span className="text-gold">maksamasta? Me autamme.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Olemme auttaneet suomalaisia pelaajia saamaan rahat takaisin kasinoilta. Lähetä valituksesi alla — käsittelemme jokaisen tapauksen ja otamme yhteyttä kasinoon puolestasi.
            </p>
          </div>
          <img src={martenLogo} alt="" width={140} height={140} className="rounded-full gold-glow hidden md:block" />
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {cmsPage?.content && (
          <div className="max-w-4xl mb-10">
            <PageContent html={cmsPage.content} />
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
          {[
            { v: totalProcessed, l: "Valitusta käsitelty" },
            { v: `${resolvedPct}%`, l: "Ratkaistu" },
            { v: `${Math.round(totalRecovered).toLocaleString("fi-FI")}€`, l: "Saatu takaisin" },
          ].map((s) => (
            <div key={s.l} className="bg-surface gold-border rounded-xl p-4 md:p-6 text-center">
              <div className="font-display text-3xl md:text-5xl text-gold leading-none">{s.v}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
          {/* Form */}
          <div className="bg-surface gold-border rounded-xl p-6">
            <h2 className="font-display text-3xl text-gold mb-1">Lähetä valitus</h2>
            <p className="text-sm text-muted-foreground mb-5">Kaikki kentät paitsi summa ovat pakollisia.</p>

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-[color:var(--success)]/15 border border-[color:var(--success)]/40 text-sm">
                ✅ Kiitos! Valituksesi on vastaanotettu. Otamme yhteyttä sähköpostitse.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/40 text-sm">
                ⚠ {error}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit.mutate();
              }}
              className="space-y-3"
            >
              <Field label="Oma nimi tai nimimerkki">
                <input
                  required maxLength={80}
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="input-field"
                />
              </Field>
              <Field label="Sähköposti">
                <input
                  required type="email" maxLength={200}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </Field>
              <Field label="Kasinon nimi">
                <input
                  required maxLength={120}
                  value={form.casino_name}
                  onChange={(e) => setForm({ ...form, casino_name: e.target.value })}
                  className="input-field"
                />
              </Field>
              <Field label="Ongelman tyyppi">
                <div className="grid sm:grid-cols-2 gap-2">
                  {Object.entries(ISSUE_LABELS).map(([k, label]) => (
                    <label key={k} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm ${form.issue_type === k ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10" : "border-[color:var(--gold)]/20 hover:bg-surface-2"}`}>
                      <input
                        type="radio" name="issue" value={k}
                        checked={form.issue_type === k}
                        onChange={() => setForm({ ...form, issue_type: k as typeof form.issue_type })}
                        className="accent-[color:var(--gold)]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Tapahtuman kuvaus (väh. 50 merkkiä)">
                <textarea
                  required minLength={50} maxLength={5000} rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-y"
                />
                <div className="text-xs text-muted-foreground mt-1">{form.description.length}/5000</div>
              </Field>
              <Field label="Summa euroissa (valinnainen)">
                <input
                  type="number" min="0" step="0.01" max="1000000"
                  value={form.amount_eur}
                  onChange={(e) => setForm({ ...form, amount_eur: e.target.value })}
                  className="input-field"
                />
              </Field>

              <button
                type="submit"
                disabled={submit.isPending}
                className="w-full px-6 py-3 rounded-lg gradient-gold text-background font-bold uppercase tracking-wider gold-glow disabled:opacity-50"
              >
                {submit.isPending ? "Lähetetään..." : "Lähetä valitus →"}
              </button>
              <p className="text-[11px] text-muted-foreground">
                Lähettämällä hyväksyt että anonymisoitu yhteenveto valituksesta voidaan julkaista alla olevassa listassa.
              </p>
            </form>
          </div>

          {/* Public list */}
          <div>
            <h2 className="font-display text-3xl mb-5">Julkiset valitukset</h2>
            <div className="bg-surface gold-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2 text-xs uppercase tracking-wider text-gold">
                    <tr>
                      <th className="text-left px-3 py-2.5">Pvm</th>
                      <th className="text-left px-3 py-2.5">Kasino</th>
                      <th className="text-left px-3 py-2.5">Ongelma</th>
                      <th className="text-right px-3 py-2.5">Summa</th>
                      <th className="text-left px-3 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Ei vielä julkaistuja valituksia.</td></tr>
                    )}
                    {complaints.map((c) => (
                      <tr key={c.id} className="border-t border-[color:var(--gold)]/10 hover:bg-surface-2/50">
                        <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{new Date(c.created_at).toLocaleDateString("fi-FI")}</td>
                        <td className="px-3 py-2.5 font-semibold">{c.casino_name}</td>
                        <td className="px-3 py-2.5">{ISSUE_LABELS[c.issue_type] ?? c.issue_type}</td>
                        <td className="px-3 py-2.5 text-right text-gold">{c.amount_eur ? `${Number(c.amount_eur).toLocaleString("fi-FI")}€` : "—"}</td>
                        <td className={`px-3 py-2.5 whitespace-nowrap ${STATUS_LABELS[c.status]?.color ?? ""}`}>
                          {STATUS_LABELS[c.status]?.label ?? c.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-br from-[color:var(--gold)]/10 to-transparent gold-border rounded-xl p-4 flex items-start gap-3">
              <img src={martenLogo} alt="" width={48} height={48} className="rounded-full" />
              <div className="text-sm">
                <div className="font-semibold text-gold mb-1">Näätä sanoo:</div>
                <p className="italic text-muted-foreground">"Avoimuus on paras lääke huijareita vastaan. Jokainen julkinen valitus auttaa muita pelaajia välttämään saman ongelman."</p>
              </div>
            </div>
          </div>
        </div>

        <AuthorBox readTime="3 min" />
      </section>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: var(--background);
          border: 1px solid color-mix(in oklab, var(--gold) 25%, transparent);
          border-radius: 0.5rem;
          color: var(--foreground);
          font-size: 0.95rem;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 2px color-mix(in oklab, var(--gold) 25%, transparent);
        }
      `}</style>
    </Layout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wider text-gold mb-1.5 font-semibold">{label}</div>
      {children}
    </label>
  );
}