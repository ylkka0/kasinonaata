import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SortableList } from "@/components/admin/SortableList";

const PRESET_PAGES: { key: string; label: string }[] = [
  { key: "/", label: "Etusivu" },
  { key: "/kasinot", label: "Kasinot" },
  { key: "/arvostelut", label: "Arvostelut" },
  { key: "/bonukset", label: "Bonukset" },
  { key: "/blogi", label: "Blogi" },
  { key: "/uutiset", label: "Uutiset" },
  { key: "/uutiset/uudet-kasinot", label: "Uutiset · Uudet kasinot" },
  { key: "/uutiset/alan-paivitykset", label: "Uutiset · Alan päivitykset" },
  { key: "/kolikkopelit", label: "Kolikkopelit" },
  { key: "/pikakasinot", label: "Pikakasinot" },
  { key: "/kotiutusnopeus", label: "Kotiutusnopeus" },
  { key: "/maksutavat", label: "Maksutavat" },
  { key: "/lisenssit", label: "Lisenssit" },
  { key: "/oppaat", label: "Oppaat" },
  { key: "/kirjoittajat", label: "Kirjoittajat" },
  { key: "/valitukset", label: "Valitukset" },
  { key: "/toimitus", label: "Toimitus" },
];

export function FaqsPanel() {
  const qc = useQueryClient();
  const [pageKey, setPageKey] = useState<string>("/");

  const { data: blogPosts = [] } = useQuery({
    queryKey: ["faqs-blog-keys"],
    queryFn: async () =>
      (await supabase.from("blog_posts").select("slug,title").order("title")).data ?? [],
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["faqs-review-keys"],
    queryFn: async () =>
      (await supabase.from("casino_reviews").select("slug,name").order("name")).data ?? [],
  });
  const { data: casinos = [] } = useQuery({
    queryKey: ["faqs-casino-keys"],
    queryFn: async () => (await supabase.from("casinos").select("slug,name").order("name")).data ?? [],
  });

  const dynamicOptions = useMemo(() => {
    const opts: { key: string; label: string }[] = [];
    for (const b of blogPosts) opts.push({ key: `/blogi/${b.slug}`, label: `Blogi · ${b.title}` });
    for (const r of reviews) opts.push({ key: `/arvostelut/${r.slug}`, label: `Arvostelu · ${r.name}` });
    for (const c of casinos) opts.push({ key: `/kasinot/${c.slug}`, label: `Kasino · ${c.name}` });
    return opts;
  }, [blogPosts, reviews, casinos]);

  const { data: faqs = [] } = useQuery({
    queryKey: ["admin-faqs", pageKey],
    queryFn: async () =>
      (
        await supabase
          .from("faqs")
          .select("*")
          .eq("page_key", pageKey)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true })
      ).data ?? [],
  });

  const empty = { question: "", answer: "", question_en: "", answer_en: "", published: true, display_order: 100 };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [tab, setTab] = useState<"fi" | "en">("fi");

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-faqs", pageKey] });
    qc.invalidateQueries({ queryKey: ["faqs", pageKey] });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageKey) return toast.error("Valitse ensin sivu.");
    const payload = { ...form, page_key: pageKey };
    const { error } = editing
      ? await supabase.from("faqs").update(payload).eq("id", editing)
      : await supabase.from("faqs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Tallennettu");
    setForm(empty);
    setEditing(null);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Poistetaanko kysymys?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Poistettu");
    refresh();
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("faqs").update({ published: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const persistOrder = async (next: typeof faqs) => {
    qc.setQueryData(["admin-faqs", pageKey], next);
    await Promise.all(
      next.map((f, idx) =>
        supabase.from("faqs").update({ display_order: idx + 1 }).eq("id", f.id),
      ),
    );
    refresh();
    toast.success("Järjestys tallennettu");
  };

  return (
    <>
      <div className="bg-surface gold-border rounded-xl p-5 mb-6">
        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Valitse sivu
        </label>
        <select
          value={PRESET_PAGES.some((p) => p.key === pageKey) || dynamicOptions.some((p) => p.key === pageKey) ? pageKey : "__custom"}
          onChange={(e) => {
            if (e.target.value === "__custom") return;
            setPageKey(e.target.value);
            setEditing(null);
            setForm(empty);
          }}
          className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2 mb-2"
        >
          <optgroup label="Yleiset sivut">
            {PRESET_PAGES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label} ({p.key})
              </option>
            ))}
          </optgroup>
          {dynamicOptions.length > 0 && (
            <optgroup label="Artikkelit, uutiset & arvostelut">
              {dynamicOptions.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          )}
          <option value="__custom">– oma polku –</option>
        </select>
        <input
          value={pageKey}
          onChange={(e) => setPageKey(e.target.value)}
          placeholder="esim. /jokin-uusi-sivu"
          className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2 font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Sivun polku määrittää missä UKK näytetään. Voit kirjoittaa myös oman polun
          (esim. uusi artikkelisivu) — UKK ilmestyy automaattisesti kyseiselle sivulle.
        </p>
      </div>

      <form
        onSubmit={save}
        className="bg-surface gold-border rounded-xl p-5 grid gap-3 mb-8"
      >
        <h2 className="font-display text-2xl text-gold">
          {editing ? "Muokkaa kysymystä" : "Uusi kysymys"} — {pageKey}
        </h2>
        <div className="flex gap-1 text-xs">
          <button type="button" onClick={() => setTab("fi")} className={`px-3 py-1.5 rounded ${tab === "fi" ? "bg-[color:var(--gold)] text-background font-bold" : "border border-[color:var(--gold)]/30"}`}>🇫🇮 Suomi</button>
          <button type="button" onClick={() => setTab("en")} className={`px-3 py-1.5 rounded ${tab === "en" ? "bg-[color:var(--gold)] text-background font-bold" : "border border-[color:var(--gold)]/30"}`}>🇬🇧 English (valinnainen)</button>
        </div>
        {tab === "fi" ? (
          <>
            <input
              className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
              placeholder="Kysymys"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              required
            />
            <textarea
              className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2 min-h-[120px]"
              placeholder="Vastaus"
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              required
            />
          </>
        ) : (
          <>
            <input
              className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
              placeholder="Question (English)"
              value={form.question_en ?? ""}
              onChange={(e) => setForm({ ...form, question_en: e.target.value })}
            />
            <textarea
              className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2 min-h-[120px]"
              placeholder="Answer (English)"
              value={form.answer_en ?? ""}
              onChange={(e) => setForm({ ...form, answer_en: e.target.value })}
            />
            <p className="text-[11px] text-muted-foreground">Jätä tyhjäksi jos et halua erillistä englanninkielistä versiota — suomenkielinen näytetään myös EN-tilassa.</p>
          </>
        )}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Julkaise (näkyy sivustolla)
        </label>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 gradient-gold text-background font-bold uppercase rounded">
            {editing ? "Päivitä" : "Tallenna"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
              className="px-4 py-2.5 border border-[color:var(--gold)]/40 rounded text-sm uppercase"
            >
              Peruuta
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-muted-foreground mb-2">
        Vedä järjestääksesi kysymykset.
      </p>
      <SortableList
        items={faqs}
        onReorder={persistOrder}
        renderItem={(f) => (
          <div className="bg-surface gold-border rounded p-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-bold">{f.question}</div>
              <div className="text-xs text-muted-foreground whitespace-pre-line line-clamp-2 mt-1">
                {f.answer}
              </div>
              <div className="text-[11px] mt-1">
                {f.published ? (
                  <span className="text-[color:var(--success)]">● Julkaistu</span>
                ) : (
                  <span>● Piilotettu</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                className="text-xs text-gold underline"
                onClick={() => togglePublished(f.id, f.published)}
              >
                {f.published ? "Piilota" : "Julkaise"}
              </button>
              <button
                className="text-xs text-gold underline"
                onClick={() => {
                  setEditing(f.id);
                  setForm({
                    question: f.question,
                    answer: f.answer,
                    question_en: (f as any).question_en ?? "",
                    answer_en: (f as any).answer_en ?? "",
                    published: f.published,
                    display_order: f.display_order,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Muokkaa
              </button>
              <button
                className="text-xs text-[color:var(--danger)] underline"
                onClick={() => remove(f.id)}
              >
                Poista
              </button>
            </div>
          </div>
        )}
      />
      {faqs.length === 0 && (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Ei vielä kysymyksiä tällä sivulla.
        </p>
      )}
    </>
  );
}