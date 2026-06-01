import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Layout } from "@/components/Layout";
import { ImageUpload } from "@/components/ImageUpload";
import { SortableList } from "@/components/admin/SortableList";
import { StringListInput } from "@/components/admin/StringListInput";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { fetchCasinoLogo } from "@/lib/casino-logos.functions";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mode = "login" as const;
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const completeAuthLink = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        window.history.replaceState({}, document.title, window.location.pathname);
        if (error) toast.error("Kirjautumis- tai vahvistuslinkki ei ole enää voimassa.");
        else toast.success("Kirjautuminen vahvistettu.");
        return;
      }

      if (window.location.hash.includes("access_token")) {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) toast.error("Kirjautumislinkki ei ole enää voimassa.");
          else toast.success("Kirjautuminen vahvistettu.");
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    void completeAuthLink();
  }, []);

  const sendPasswordReset = async () => {
    if (!email) {
      toast.error("Kirjoita ensin admin-sähköposti kenttään.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Salasanan palautuslinkki lähetetty sähköpostiin.");
  };

  const sendLoginLink = async () => {
    if (!email) {
      toast.error("Kirjoita ensin admin-sähköposti kenttään.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/admin", shouldCreateUser: false },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Kirjautumislinkki lähetetty sähköpostiin. Avaa linkki samalla selaimella.");
  };

  const auth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      toast.error(
        error.message === "Invalid login credentials"
          ? "Sähköposti tai salasana on väärä. Tili on jo vahvistettu — kokeile salasanan palautusta."
          : error.message,
      );
    } else {
      toast.success("Tervetuloa");
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="p-10">...</div>
      </Layout>
    );

  if (!user) {
    return (
      <Layout>
        <section className="container mx-auto max-w-sm px-4 py-16">
          <h1 className="font-display text-4xl mb-2">Admin</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Kirjaudu CMS:ään salasanalla tai sähköpostilinkillä. Uudet admin-tilit luodaan vain
            kutsulla CMS:n käyttäjähallinnasta.
          </p>
          <form onSubmit={auth} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Sähköposti"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Salasana"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
            />
            <button
              disabled={submitting}
              className="w-full px-4 py-2.5 gradient-gold text-background font-bold uppercase rounded disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Hetki..." : "Kirjaudu"}
            </button>
            <button
              type="button"
              disabled={submitting}
              className="w-full px-4 py-2.5 border border-[color:var(--gold)]/40 rounded text-sm font-bold uppercase text-gold hover:bg-surface disabled:opacity-60"
              onClick={sendLoginLink}
            >
              Kirjaudu sähköpostilinkillä
            </button>
            <button
              type="button"
              disabled={submitting}
              className="w-full text-xs text-gold hover:underline disabled:opacity-60"
              onClick={sendPasswordReset}
            >
              Unohditko salasanan?
            </button>
            <Link
              to="/reset-password"
              className="block text-center text-[11px] text-muted-foreground hover:text-gold"
            >
              Onko sinulla palautuslinkki? Vaihda salasana tästä
            </Link>
          </form>
        </section>
      </Layout>
    );
  }

  if (!isAdmin)
    return (
      <Layout>
        <div className="container mx-auto p-10">
          Ei adminoikeuksia.{" "}
          <button onClick={() => supabase.auth.signOut()} className="underline">
            Kirjaudu ulos
          </button>
        </div>
      </Layout>
    );

  return <AdminDash />;
}

type Tab = "home" | "casinos" | "reviews" | "blog" | "pages" | "settings" | "users";

function AdminDash() {
  const [tab, setTab] = useState<Tab>("home");
  return (
    <Layout>
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="font-display text-4xl">CMS</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm underline text-muted-foreground hover:text-gold"
          >
            Kirjaudu ulos
          </button>
        </div>
        <div className="flex gap-2 mb-8 border-b border-[color:var(--gold)]/20">
          {(
            [
              { id: "home", label: "Etusivu" },
              { id: "casinos", label: "Kasinot" },
              { id: "reviews", label: "Arvostelut" },
              { id: "blog", label: "Blogi" },
              { id: "pages", label: "Sivut & sisältö" },
              { id: "settings", label: "Asetukset" },
              { id: "users", label: "Käyttäjät" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 font-semibold uppercase tracking-wider text-sm border-b-2 -mb-px ${
                tab === t.id
                  ? "border-[color:var(--gold)] text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "home" && <HomePanel />}
        {tab === "casinos" && <CasinosPanel />}
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "blog" && <BlogPanel />}
        {tab === "pages" && <PagesPanel />}
        {tab === "settings" && <SettingsPanel />}
        {tab === "users" && <UsersPanel />}
      </section>
    </Layout>
  );
}

function CasinosPanel() {
  const qc = useQueryClient();
  const { data: casinos = [] } = useQuery({
    queryKey: ["admin-casinos"],
    queryFn: async () => (await supabase.from("casinos").select("*").order("ranking")).data ?? [],
  });
  const empty = {
    name: "",
    slug: "",
    bonus_text: "",
    rating: 8,
    affiliate_link: "",
    ranking: 100,
    tags: "",
    review_text: "",
    logo_url: "" as string | null,
    pros: [] as string[],
    cons: [] as string[],
  };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      bonus_text: form.bonus_text,
      rating: Number(form.rating),
      affiliate_link: form.affiliate_link,
      ranking: Number(form.ranking),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      review_text: form.review_text,
      logo_url: form.logo_url,
      pros: form.pros,
      cons: form.cons,
    };
    const { error } = editing
      ? await supabase.from("casinos").update(payload).eq("id", editing)
      : await supabase.from("casinos").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Tallennettu");
    setForm(empty);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-casinos"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Poistetaanko?")) return;
    await supabase.from("casinos").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-casinos"] });
  };

  const persistOrder = async (next: typeof casinos) => {
    qc.setQueryData(["admin-casinos"], next);
    await Promise.all(
      next.map((c, idx) =>
        supabase
          .from("casinos")
          .update({ ranking: idx + 1 })
          .eq("id", c.id),
      ),
    );
    qc.invalidateQueries({ queryKey: ["admin-casinos"] });
    qc.invalidateQueries({ queryKey: ["casinos"] });
    toast.success("Järjestys tallennettu");
  };

  return (
    <>
      <form
        onSubmit={save}
        className="bg-surface gold-border rounded-xl p-5 grid md:grid-cols-2 gap-3 mb-8"
      >
        <h2 className="md:col-span-2 font-display text-2xl text-gold">
          {editing ? "Muokkaa kasinoa" : "Lisää uusi kasino"}
        </h2>
        <div className="md:col-span-2">
          <ImageUpload
            bucket="casino-logos"
            value={form.logo_url}
            onChange={(url) => setForm({ ...form, logo_url: url })}
            label="Kasinon logo"
          />
        </div>
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Nimi"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Slug (esim. lucky-spins)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Bonusteksti"
          value={form.bonus_text}
          onChange={(e) => setForm({ ...form, bonus_text: e.target.value })}
        />
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Affiliate-linkki"
          value={form.affiliate_link}
          onChange={(e) => setForm({ ...form, affiliate_link: e.target.value })}
        />
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Arvio 1-10"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        />
        <input
          type="number"
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Sijoitus"
          value={form.ranking}
          onChange={(e) => setForm({ ...form, ranking: Number(e.target.value) })}
        />
        <input
          className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Tagit (pilkulla erotettuna)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <textarea
          className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          rows={3}
          placeholder="Arvostelu"
          value={form.review_text}
          onChange={(e) => setForm({ ...form, review_text: e.target.value })}
        />
        <div className="bg-background/50 rounded-lg p-3 border border-[color:var(--gold)]/20">
          <StringListInput
            label="Plussat"
            value={form.pros}
            onChange={(pros) => setForm({ ...form, pros })}
            placeholder="Esim. Välittömät kotiutukset"
            accentClass="text-[color:var(--success)]"
          />
        </div>
        <div className="bg-background/50 rounded-lg p-3 border border-[color:var(--gold)]/20">
          <StringListInput
            label="Miinukset"
            value={form.cons}
            onChange={(cons) => setForm({ ...form, cons })}
            placeholder="Esim. Rajoitettu pelivalikoima"
            accentClass="text-[color:var(--danger)]"
          />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button className="flex-1 px-4 py-2.5 gradient-gold text-background font-bold uppercase rounded">
            {editing ? "Päivitä" : "Lisää kasino"}
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
        Vedä riveistä järjestääksesi kasinoja. Järjestys päivittyy myös etusivulle.
      </p>
      <SortableList
        items={casinos}
        onReorder={persistOrder}
        renderItem={(c) => (
          <div className="bg-surface gold-border rounded p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded bg-background/60 border border-[color:var(--gold)]/20 p-1 flex items-center justify-center shrink-0">
                {c.logo_url ? (
                  <img src={c.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">Ei logoa</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-muted-foreground text-xs">
                  ⭐ {c.rating} · {c.pros?.length ?? 0} plussaa · {c.cons?.length ?? 0} miinusta
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                className="text-xs text-gold underline"
                onClick={() => {
                  setEditing(c.id);
                  setForm({
                    name: c.name,
                    slug: c.slug,
                    bonus_text: c.bonus_text ?? "",
                    rating: Number(c.rating),
                    affiliate_link: c.affiliate_link ?? "",
                    ranking: c.ranking,
                    tags: (c.tags ?? []).join(", "),
                    review_text: c.review_text ?? "",
                    logo_url: c.logo_url ?? null,
                    pros: c.pros ?? [],
                    cons: c.cons ?? [],
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Muokkaa
              </button>
              <button
                className="text-xs text-[color:var(--danger)] underline"
                onClick={() => remove(c.id)}
              >
                Poista
              </button>
            </div>
          </div>
        )}
      />
    </>
  );
}

function BlogPanel() {
  const qc = useQueryClient();
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () =>
      (
        await supabase
          .from("blog_posts")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false })
      ).data ?? [],
  });
  const empty = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Kasinonäätä",
    tags: "",
    published: false,
    cover_image_url: null as string | null,
    meta_title: "",
    meta_description: "",
  };
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      author: form.author,
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      published: form.published,
      cover_image_url: form.cover_image_url,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      published_at: form.published ? new Date().toISOString() : null,
    };
    const { error } = editing
      ? await supabase.from("blog_posts").update(payload).eq("id", editing)
      : await supabase.from("blog_posts").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Tallennettu");
    setForm(empty);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Poistetaanko?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };

  const persistOrder = async (next: typeof posts) => {
    qc.setQueryData(["admin-blog"], next);
    await Promise.all(
      next.map((p, idx) =>
        supabase
          .from("blog_posts")
          .update({ display_order: idx + 1 })
          .eq("id", p.id),
      ),
    );
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    qc.invalidateQueries({ queryKey: ["blog-posts"] });
    toast.success("Järjestys tallennettu");
  };

  return (
    <>
      <form
        onSubmit={save}
        className="bg-surface gold-border rounded-xl p-5 grid md:grid-cols-2 gap-3 mb-8"
      >
        <h2 className="md:col-span-2 font-display text-2xl text-gold">
          {editing ? "Muokkaa artikkelia" : "Uusi blogiartikkeli"}
        </h2>
        <div className="md:col-span-2">
          <ImageUpload
            bucket="blog-images"
            value={form.cover_image_url}
            onChange={(url) => setForm({ ...form, cover_image_url: url })}
            label="Kansikuva"
            folder="covers"
          />
        </div>
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Otsikko"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Slug (url-osa)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
        <textarea
          className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          rows={2}
          placeholder="Lyhyt ote (näkyy listauksessa)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Sisältö
          </label>
          <RichTextEditor
            value={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
          />
        </div>
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Kirjoittaja"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="Tagit (pilkulla)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="SEO meta-otsikko"
          value={form.meta_title}
          onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
        />
        <input
          className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          placeholder="SEO meta-kuvaus"
          value={form.meta_description}
          onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
        />
        <label className="md:col-span-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Julkaise (näkyy sivustolla)
        </label>
        <div className="md:col-span-2 flex gap-2">
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
        Vedä artikkeleita järjestääksesi ne blogi-sivulla.
      </p>
      <SortableList
        items={posts}
        onReorder={persistOrder}
        renderItem={(p) => (
          <div className="bg-surface gold-border rounded p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {p.cover_image_url && (
                <img src={p.cover_image_url} alt="" className="w-12 h-12 rounded object-cover" />
              )}
              <div className="min-w-0">
                <div className="font-bold truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.published ? (
                    <span className="text-[color:var(--success)]">● Julkaistu</span>
                  ) : (
                    <span>● Luonnos</span>
                  )}{" "}
                  · /{p.slug}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                className="text-xs text-gold underline"
                onClick={() => {
                  setEditing(p.id);
                  setForm({
                    title: p.title,
                    slug: p.slug,
                    excerpt: p.excerpt ?? "",
                    content: p.content,
                    author: p.author,
                    tags: (p.tags ?? []).join(", "),
                    published: p.published,
                    cover_image_url: p.cover_image_url,
                    meta_title: p.meta_title ?? "",
                    meta_description: p.meta_description ?? "",
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Muokkaa
              </button>
              <button
                className="text-xs text-[color:var(--danger)] underline"
                onClick={() => remove(p.id)}
              >
                Poista
              </button>
            </div>
          </div>
        )}
      />
      {posts.length === 0 && (
        <p className="text-sm text-muted-foreground py-6 text-center">Ei vielä artikkeleita.</p>
      )}
    </>
  );
}

function UsersPanel() {
  const { user } = useAuth();
  const qc = useQueryClient();

  type AdminUser = {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    confirmed: boolean;
    isAdmin: boolean;
  };

  const call = async <T = any,>(body: Record<string, unknown>): Promise<T> => {
    const { data, error } = await supabase.functions.invoke("admin-users", { body });
    if (error) {
      let msg = (data as any)?.error || error.message || "Virhe";
      // supabase-js wraps non-2xx in FunctionsHttpError; read the actual response body
      const ctx = (error as any)?.context;
      if (ctx && typeof ctx.json === "function") {
        try {
          const body = await ctx.json();
          if (body?.error) msg = body.error;
        } catch {
          try {
            const txt = await ctx.text();
            if (txt) msg = txt;
          } catch {
            /* ignore */
          }
        }
      }
      throw new Error(msg);
    }
    if (data && (data as any).error) throw new Error((data as any).error);
    return data as T;
  };

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await call<{ users: AdminUser[] }>({ action: "list" });
      return res.users ?? [];
    },
    retry: false,
  });

  const [email, setEmail] = useState("");
  const [makeAdmin, setMakeAdmin] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await call({ action: "invite", email, makeAdmin });
      toast.success(`Kutsu lähetetty: ${email}`);
      setEmail("");
      setMakeAdmin(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kutsu epäonnistui");
    } finally {
      setBusy(false);
    }
  };

  const toggleAdmin = async (id: string, next: boolean) => {
    try {
      await call({ action: "setAdmin", userId: id, admin: next });
      toast.success(next ? "Admin-oikeudet annettu" : "Admin-oikeudet poistettu");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Päivitys epäonnistui");
    }
  };

  const handleDelete = async (id: string, mail: string) => {
    if (!confirm(`Poistetaanko käyttäjä ${mail}? Tätä ei voi perua.`)) return;
    try {
      await call({ action: "delete", userId: id });
      toast.success("Käyttäjä poistettu");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Poisto epäonnistui");
    }
  };

  const handleSetPassword = async (id: string, mail: string) => {
    const password = window.prompt(`Anna uusi salasana käyttäjälle ${mail} (vähintään 8 merkkiä):`);
    if (password === null) return;
    if (password.length < 8) {
      toast.error("Salasanan tulee olla vähintään 8 merkkiä");
      return;
    }
    try {
      await call({ action: "setPassword", userId: id, password });
      toast.success(`Salasana päivitetty käyttäjälle ${mail}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Salasanan vaihto epäonnistui");
    }
  };

  return (
    <>
      <form
        onSubmit={handleInvite}
        className="bg-surface gold-border rounded-xl p-5 mb-8 grid md:grid-cols-[1fr_auto_auto] gap-3 items-end"
      >
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            Kutsu uusi käyttäjä
          </label>
          <input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
          <input
            type="checkbox"
            checked={makeAdmin}
            onChange={(e) => setMakeAdmin(e.target.checked)}
          />
          Admin-oikeudet
        </label>
        <button
          disabled={busy}
          className="px-4 py-2.5 gradient-gold text-background font-bold uppercase rounded disabled:opacity-60"
        >
          {busy ? "Lähetetään..." : "Lähetä kutsu"}
        </button>
        <p className="md:col-span-3 text-xs text-muted-foreground">
          Käyttäjä saa sähköpostiinsa kutsulinkin, jolla hän asettaa salasanan ja kirjautuu.
        </p>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Ladataan käyttäjiä...</p>}

      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-surface gold-border rounded p-3 flex items-center justify-between gap-3 flex-wrap"
          >
            <div className="min-w-0">
              <div className="font-bold truncate flex items-center gap-2">
                {u.email}
                {u.isAdmin && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[color:var(--gold)]/20 text-gold">
                    Admin
                  </span>
                )}
                {!u.confirmed && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-background border border-[color:var(--gold)]/30 text-muted-foreground">
                    Vahvistamaton
                  </span>
                )}
                {u.id === user?.id && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    (sinä)
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Liittynyt {new Date(u.created_at).toLocaleDateString("fi-FI")}
                {u.last_sign_in_at &&
                  ` · Viimeksi ${new Date(u.last_sign_in_at).toLocaleDateString("fi-FI")}`}
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              {u.id !== user?.id && (
                <button
                  className="text-xs text-gold underline"
                  onClick={() => toggleAdmin(u.id, !u.isAdmin)}
                >
                  {u.isAdmin ? "Poista admin" : "Tee adminiksi"}
                </button>
              )}
              <button
                className="text-xs text-gold underline"
                onClick={() => handleSetPassword(u.id, u.email)}
              >
                Aseta salasana
              </button>
              {u.id !== user?.id && (
                <button
                  className="text-xs text-[color:var(--danger)] underline"
                  onClick={() => handleDelete(u.id, u.email)}
                >
                  Poista
                </button>
              )}
            </div>
          </div>
        ))}
        {!isLoading && users.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">Ei käyttäjiä.</p>
        )}
      </div>
    </>
  );
}
function PagesPanel() {
  const qc = useQueryClient();
  const { data: pages = [] } = useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => (await supabase.from("pages").select("*").order("slug")).data ?? [],
  });
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [newPage, setNewPage] = useState({ slug: "", title: "" });

  const PAGE_GROUPS: { label: string; slugs: string[] }[] = [
    { label: "Päävalikko", slugs: ["etusivu", "kasinot", "uutiset", "arvostelut", "maksutavat", "lisenssit", "oppaat", "toimitus"] },
    { label: "Uutiset – alasivut", slugs: ["uutiset-uudet-kasinot", "uutiset-alan-paivitykset"] },
    { label: "Arvostelut – alasivut", slugs: ["pikakasinot", "kotiutusnopeus"] },
    { label: "Oppaat – alasivut", slugs: ["bonukset", "kolikkopelit"] },
    { label: "Blogi & Kirjoittajat", slugs: ["blogi", "kirjoittajat"] },
    { label: "Muut sivut", slugs: ["valitukset"] },
  ];

  const SLUG_TITLES: Record<string, string> = {
    etusivu: "Etusivu",
    kasinot: "Kasinot",
    uutiset: "Uutiset",
    arvostelut: "Arvostelut",
    maksutavat: "Maksutavat",
    lisenssit: "Lisenssit",
    oppaat: "Oppaat",
    toimitus: "Toimitus",
    "uutiset-uudet-kasinot": "Uudet kasinot",
    "uutiset-alan-paivitykset": "Alan päivitykset",
    pikakasinot: "Pikakasinot",
    kotiutusnopeus: "Kotiutusnopeus",
    bonukset: "Bonukset",
    kolikkopelit: "Kolikkopelit",
    blogi: "Blogi",
    kirjoittajat: "Kirjoittajat",
    valitukset: "Valitukset",
  };

  const ROUTE_FOR_SLUG: Record<string, string> = {
    etusivu: "/",
    "uutiset-uudet-kasinot": "/uutiset/uudet-kasinot",
    "uutiset-alan-paivitykset": "/uutiset/alan-paivitykset",
  };

  const openOrCreate = async (slug: string) => {
    const existing = pages.find((p: any) => p.slug === slug);
    if (existing) {
      setEditing(existing);
      return;
    }
    const title = SLUG_TITLES[slug] ?? slug;
    const { data, error } = await supabase
      .from("pages")
      .insert({ slug, title, content: "" })
      .select()
      .single();
    if (error) return toast.error(error.message);
    await qc.invalidateQueries({ queryKey: ["admin-pages"] });
    setEditing(data);
  };

  const createPage = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newPage.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    if (!slug || !newPage.title.trim()) return toast.error("Slug ja otsikko vaaditaan");
    const { error } = await supabase.from("pages").insert({ slug, title: newPage.title.trim(), content: "" });
    if (error) return toast.error(error.message);
    toast.success("Sivu luotu");
    setNewPage({ slug: "", title: "" });
    setCreating(false);
    qc.invalidateQueries({ queryKey: ["admin-pages"] });
  };

  const removePage = async (id: string, slug: string) => {
    if (!confirm(`Poistetaanko sivu /${slug}? Reitti voi jäädä rikki jos sitä käytetään.`)) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Sivu poistettu");
    qc.invalidateQueries({ queryKey: ["admin-pages"] });
  };

  const save = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("pages")
      .update({
        title: editing.title,
        meta_title: editing.meta_title,
        meta_description: editing.meta_description,
        content: editing.content,
      })
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Sivu tallennettu");
    qc.invalidateQueries({ queryKey: ["admin-pages"] });
    qc.invalidateQueries({ queryKey: ["page", editing.slug] });
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <button onClick={() => setEditing(null)} className="text-sm text-gold underline">
          ← Takaisin
        </button>
        <div className="bg-surface gold-border rounded-xl p-5 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              Otsikko
            </label>
            <input
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                SEO Meta Title
              </label>
              <input
                value={editing.meta_title ?? ""}
                onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                SEO Meta Description
              </label>
              <input
                value={editing.meta_description ?? ""}
                onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              Sisältö (rich text)
            </label>
            <RichTextEditor
              value={editing.content ?? ""}
              onChange={(v) => setEditing({ ...editing, content: v })}
            />
            <p className="text-[11px] text-muted-foreground mt-2">
              Voit upottaa lohkoja: <code>[casinos limit=5]</code> näyttää top-kasinot,{" "}
              <code>[bonus_alerts]</code> näyttää aktiiviset bonusilmoitukset.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="px-4 py-2 gradient-gold text-background font-bold uppercase rounded"
            >
              Tallenna
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 border border-[color:var(--gold)]/40 rounded"
            >
              Peruuta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">
          Muokkaa sivujen sisältöä, otsikoita ja SEO-tietoja. Lisää tekstiä, kuvia ja artikkeleita rikastetulla editorilla.
        </p>
        <button
          onClick={() => setCreating((v) => !v)}
          className="text-xs uppercase tracking-wider px-3 py-1.5 rounded border border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"
        >
          {creating ? "Peruuta" : "+ Uusi sivu"}
        </button>
      </div>

      {creating && (
        <form onSubmit={createPage} className="bg-surface gold-border rounded-xl p-4 grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end mb-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Slug</label>
            <input
              value={newPage.slug}
              onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
              placeholder="esim. uusi-sivu"
              className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Otsikko</label>
            <input
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              placeholder="Sivun otsikko"
              className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
            />
          </div>
          <button className="px-4 py-2 gradient-gold text-background font-bold uppercase rounded text-sm">Luo</button>
        </form>
      )}

      {PAGE_GROUPS.map((group) => (
        <div key={group.label} className="mb-5">
          <h3 className="text-xs uppercase tracking-widest text-gold mb-2">{group.label}</h3>
          <div className="space-y-2">
            {group.slugs.map((slug) => {
              const p = pages.find((x: any) => x.slug === slug);
              const title = p?.title ?? SLUG_TITLES[slug] ?? slug;
              const route = ROUTE_FOR_SLUG[slug] ?? `/${slug}`;
              return (
                <div key={slug} className="bg-surface gold-border rounded p-3 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold">
                      {title}
                      {!p && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                          (ei vielä CMS-sisältöä)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{route}</div>
                  </div>
                  <div className="flex gap-3">
                    <a href={route} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground underline">Avaa</a>
                    <button onClick={() => openOrCreate(slug)} className="text-sm text-gold underline">
                      {p ? "Muokkaa" : "Luo & muokkaa"}
                    </button>
                    {p && (
                      <button onClick={() => removePage(p.id, p.slug)} className="text-sm text-[color:var(--danger)] underline">Poista</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {(() => {
        const knownSlugs = new Set(PAGE_GROUPS.flatMap((g) => g.slugs));
        const others = pages.filter((p: any) => !knownSlugs.has(p.slug));
        if (others.length === 0) return null;
        return (
          <div className="mb-5">
            <h3 className="text-xs uppercase tracking-widest text-gold mb-2">Mukautetut sivut</h3>
            <div className="space-y-2">
              {others.map((p: any) => (
                <div key={p.id} className="bg-surface gold-border rounded p-3 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditing(p)} className="text-sm text-gold underline">Muokkaa</button>
                    <button onClick={() => removePage(p.id, p.slug)} className="text-sm text-[color:var(--danger)] underline">Poista</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function HomePanel() {
  const qc = useQueryClient();
  const { data: casinos = [] } = useQuery({
    queryKey: ["admin-casinos"],
    queryFn: async () => (await supabase.from("casinos").select("*").order("ranking")).data ?? [],
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () =>
      (
        await supabase
          .from("blog_posts")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false })
      ).data ?? [],
  });
  const { data: page } = useQuery({
    queryKey: ["admin-page", "etusivu"],
    queryFn: async () => (await supabase.from("pages").select("*").eq("slug", "etusivu").maybeSingle()).data,
  });

  const top3 = casinos.slice(0, 3);
  const rest = casinos.slice(3);

  const reorderCasinos = async (next: typeof casinos) => {
    qc.setQueryData(["admin-casinos"], next);
    await Promise.all(
      next.map((c, idx) =>
        supabase.from("casinos").update({ ranking: idx + 1 }).eq("id", c.id),
      ),
    );
    qc.invalidateQueries({ queryKey: ["admin-casinos"] });
    qc.invalidateQueries({ queryKey: ["casinos-top3"] });
    qc.invalidateQueries({ queryKey: ["casinos-kasinot"] });
    toast.success("Järjestys tallennettu");
  };

  const moveToTop = async (id: string) => {
    const next = [casinos.find((c) => c.id === id)!, ...casinos.filter((c) => c.id !== id)];
    await reorderCasinos(next);
  };

  const [quickAdd, setQuickAdd] = useState({
    name: "",
    slug: "",
    bonus_text: "",
    rating: 9.0,
    affiliate_link: "",
    logo_url: "",
  });

  const addToTop3 = async () => {
    if (!quickAdd.name.trim() || !quickAdd.slug.trim()) {
      toast.error("Anna vähintään nimi ja slug");
      return;
    }
    // Push all existing casinos down by 1 in ranking, then insert new at rank 1
    const { data: inserted, error } = await supabase
      .from("casinos")
      .insert({
        name: quickAdd.name.trim(),
        slug: quickAdd.slug.trim(),
        bonus_text: quickAdd.bonus_text || null,
        rating: Number(quickAdd.rating) || 9.0,
        affiliate_link: quickAdd.affiliate_link || null,
        logo_url: quickAdd.logo_url || null,
        ranking: 0,
      })
      .select()
      .single();
    if (error || !inserted) return toast.error(error?.message ?? "Virhe");
    const next = [inserted as any, ...casinos.filter((c) => c.id !== (inserted as any).id)];
    await reorderCasinos(next);
    setQuickAdd({ name: "", slug: "", bonus_text: "", rating: 9.0, affiliate_link: "", logo_url: "" });
    toast.success(`${(inserted as any).name} lisätty Top 3:een`);
  };

  const promoteSelect = async (id: string) => {
    if (!id) return;
    await moveToTop(id);
  };

  const togglePostFeatured = async (id: string, currentOrder: number) => {
    const isFeatured = currentOrder > 0 && currentOrder <= 6;
    const next = isFeatured ? 100 : 1;
    const { error } = await supabase.from("blog_posts").update({ display_order: next }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    qc.invalidateQueries({ queryKey: ["home-blog-posts"] });
    toast.success(isFeatured ? "Poistettu etusivulta" : "Lisätty etusivulle");
  };

  return (
    <div className="space-y-8">
      <div className="bg-surface gold-border rounded-xl p-5">
        <h2 className="font-display text-2xl text-gold mb-2">Toukokuun parhaat – Top 3</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Nämä kolme kasinoa näkyvät etusivun isossa nostossa. Vedä järjestämään tai paina "Nosta TOP 3:een".
        </p>

        <div className="bg-background/60 rounded-lg p-3 mb-4 space-y-3">
          <div className="text-xs uppercase tracking-widest text-gold font-bold">+ Lisää kasino suoraan Top 3:een</div>

          {rest.length > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground shrink-0">Olemassa olevasta:</span>
              <select
                onChange={(e) => { promoteSelect(e.target.value); e.currentTarget.value = ""; }}
                defaultValue=""
                className="flex-1 bg-background border border-[color:var(--gold)]/30 rounded px-2 py-1.5 text-sm"
              >
                <option value="">Valitse kasino…</option>
                {rest.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="text-[11px] uppercase tracking-wider text-muted-foreground pt-1">tai luo uusi:</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Nimi *"
              value={quickAdd.name}
              onChange={(e) => setQuickAdd({ ...quickAdd, name: e.target.value, slug: quickAdd.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })}
              className="bg-background border border-[color:var(--gold)]/30 rounded px-2 py-1.5 text-sm"
            />
            <input
              placeholder="slug *"
              value={quickAdd.slug}
              onChange={(e) => setQuickAdd({ ...quickAdd, slug: e.target.value })}
              className="bg-background border border-[color:var(--gold)]/30 rounded px-2 py-1.5 text-sm"
            />
            <input
              placeholder="Bonusteksti"
              value={quickAdd.bonus_text}
              onChange={(e) => setQuickAdd({ ...quickAdd, bonus_text: e.target.value })}
              className="bg-background border border-[color:var(--gold)]/30 rounded px-2 py-1.5 text-sm col-span-2"
            />
            <input
              type="number"
              step="0.1"
              min={0}
              max={10}
              placeholder="Arvosana"
              value={quickAdd.rating}
              onChange={(e) => setQuickAdd({ ...quickAdd, rating: Number(e.target.value) })}
              className="bg-background border border-[color:var(--gold)]/30 rounded px-2 py-1.5 text-sm"
            />
            <input
              placeholder="Affiliate-linkki"
              value={quickAdd.affiliate_link}
              onChange={(e) => setQuickAdd({ ...quickAdd, affiliate_link: e.target.value })}
              className="bg-background border border-[color:var(--gold)]/30 rounded px-2 py-1.5 text-sm"
            />
            <input
              placeholder="Logon URL"
              value={quickAdd.logo_url}
              onChange={(e) => setQuickAdd({ ...quickAdd, logo_url: e.target.value })}
              className="bg-background border border-[color:var(--gold)]/30 rounded px-2 py-1.5 text-sm col-span-2"
            />
          </div>
          <button
            onClick={addToTop3}
            className="w-full px-3 py-2 text-sm font-bold uppercase tracking-wider gradient-gold text-background rounded"
          >
            Lisää Top 3:een
          </button>
          <p className="text-[10px] text-muted-foreground">Täydet tiedot (kuvat, plussat, miinukset jne.) voi muokata "Kasinot"-välilehdeltä.</p>
        </div>

        <SortableList
          items={top3}
          onReorder={(next) => reorderCasinos([...next, ...rest])}
          renderItem={(c) => {
            const idx = top3.findIndex((t) => t.id === c.id);
            return (
              <div className="bg-background/60 rounded p-3 flex items-center gap-3">
                <span className="font-display text-2xl text-gold w-6">{idx + 1}</span>
                {c.logo_url && <img src={c.logo_url} alt="" className="w-10 h-10 rounded object-contain bg-background/60 p-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.bonus_text}</div>
                </div>
                <span className="text-xs text-gold">★ {Number(c.rating).toFixed(1)}</span>
              </div>
            );
          }}
        />
      </div>

      <div className="bg-surface gold-border rounded-xl p-5">
        <h2 className="font-display text-2xl text-gold mb-2">Muut kasinot</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Kaikki muut kasinot listalla. Paina "Nosta TOP 3:een" siirtääksesi kasinon etusivun pääkortille.
        </p>
        <div className="space-y-2">
          {rest.map((c) => (
            <div key={c.id} className="bg-background/60 rounded p-3 flex items-center gap-3">
              {c.logo_url && <img src={c.logo_url} alt="" className="w-10 h-10 rounded object-contain bg-background/60 p-0.5" />}
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.bonus_text}</div>
              </div>
              <button
                onClick={() => moveToTop(c.id)}
                className="text-xs uppercase tracking-wider px-2.5 py-1 rounded border border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"
              >
                Nosta TOP 3:een
              </button>
            </div>
          ))}
          {rest.length === 0 && <p className="text-sm text-muted-foreground">Ei muita kasinoita.</p>}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Lisää uusia kasinoita "Kasinot"-välilehdeltä.
        </p>
      </div>

      <div className="bg-surface gold-border rounded-xl p-5">
        <h2 className="font-display text-2xl text-gold mb-2">Etusivun artikkelit</h2>
        <p className="text-sm text-muted-foreground mb-4">
          6 ensimmäistä julkaistua artikkelia näkyvät etusivulla. Säädä järjestystä "Blogi"-välilehdellä.
        </p>
        <div className="space-y-2">
          {posts.slice(0, 12).map((p: any) => {
            const featured = p.published && p.display_order > 0 && p.display_order <= 6;
            return (
              <div key={p.id} className="bg-background/60 rounded p-3 flex items-center gap-3">
                {p.cover_image_url && <img src={p.cover_image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.published ? <span className="text-[color:var(--success)]">● Julkaistu</span> : <span>● Luonnos</span>} · järjestys {p.display_order}
                  </div>
                </div>
                <button
                  onClick={() => togglePostFeatured(p.id, p.display_order ?? 0)}
                  className={`text-xs uppercase tracking-wider px-2.5 py-1 rounded border ${featured ? "border-[color:var(--gold)] text-background bg-[color:var(--gold)]" : "border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"}`}
                >
                  {featured ? "Poista etusivulta" : "Lisää etusivulle"}
                </button>
              </div>
            );
          })}
          {posts.length === 0 && <p className="text-sm text-muted-foreground">Ei artikkeleita. Lisää "Blogi"-välilehdeltä.</p>}
        </div>
      </div>

      <div className="bg-surface gold-border rounded-xl p-5">
        <h2 className="font-display text-2xl text-gold mb-2">Etusivun vapaa sisältö</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Etusivun lisäteksti (slug: <code>etusivu</code>) renderöidään etusivulla. Muokkaa "Sivut & sisältö" → Etusivu.
        </p>
        {page && (
          <div className="text-xs text-muted-foreground">Otsikko: <strong className="text-foreground">{page.title}</strong></div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => (await supabase.from("site_settings").select("*")).data ?? [],
  });
  const header = rows.find((r: any) => r.key === "header")?.value;
  const footer = rows.find((r: any) => r.key === "footer")?.value;
  const [headerJson, setHeaderJson] = useState("");
  const [footerJson, setFooterJson] = useState("");

  if (header && headerJson === "") setHeaderJson(JSON.stringify(header, null, 2));
  if (footer && footerJson === "") setFooterJson(JSON.stringify(footer, null, 2));

  const saveKey = async (key: string, raw: string) => {
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return toast.error("Virheellinen JSON");
    }
    const { error } = await supabase.from("site_settings").update({ value: parsed }).eq("key", key);
    if (error) return toast.error(error.message);
    toast.success(`${key} tallennettu`);
    qc.invalidateQueries({ queryKey: ["site-setting", key] });
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Muokkaa headerin ja footerin rakennetta. Lisää, järjestä tai poista linkkejä muokkaamalla
        JSON-rakennetta.
      </p>
      <div className="bg-surface gold-border rounded-xl p-5 space-y-3">
        <h3 className="font-display text-2xl">Header (yläpalkki + valikot)</h3>
        <textarea
          value={headerJson}
          onChange={(e) => setHeaderJson(e.target.value)}
          rows={20}
          className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2 font-mono text-xs"
        />
        <button
          onClick={() => saveKey("header", headerJson)}
          className="px-4 py-2 gradient-gold text-background font-bold uppercase rounded"
        >
          Tallenna header
        </button>
      </div>
      <div className="bg-surface gold-border rounded-xl p-5 space-y-3">
        <h3 className="font-display text-2xl">Footer (alapalkki)</h3>
        <textarea
          value={footerJson}
          onChange={(e) => setFooterJson(e.target.value)}
          rows={20}
          className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2 font-mono text-xs"
        />
        <button
          onClick={() => saveKey("footer", footerJson)}
          className="px-4 py-2 gradient-gold text-background font-bold uppercase rounded"
        >
          Tallenna footer
        </button>
      </div>
      <ChangePasswordCard />
    </div>
  );
}

function ChangePasswordCard() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Salasanan pitää olla vähintään 8 merkkiä.");
    if (password !== confirm) return toast.error("Salasanat eivät täsmää.");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      const msg = error.message || "Salasanan vaihto epäonnistui";
      if (/different|same.*password/i.test(msg)) return toast.error("Uuden salasanan pitää erota vanhasta.");
      if (/weak|short|characters|HIBP|pwned/i.test(msg)) return toast.error("Salasana on liian heikko. Käytä pidempää ja vahvempaa salasanaa.");
      return toast.error(msg);
    }
    toast.success("Salasana vaihdettu.");
    setPassword("");
    setConfirm("");
  };

  return (
    <div className="bg-surface gold-border rounded-xl p-5 space-y-3">
      <h3 className="font-display text-2xl">Vaihda salasana</h3>
      <p className="text-sm text-muted-foreground">
        Aseta uusi salasana admin-tilillesi. Olet jo kirjautunut, joten vanhaa salasanaa ei tarvita.
      </p>
      <form onSubmit={submit} className="space-y-3 max-w-sm">
        <input
          type="password"
          required
          minLength={8}
          placeholder="Uusi salasana (väh. 8 merkkiä)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Vahvista uusi salasana"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2"
        />
        <button
          disabled={submitting}
          className="px-4 py-2 gradient-gold text-background font-bold uppercase rounded disabled:opacity-60"
        >
          {submitting ? "Hetki..." : "Tallenna uusi salasana"}
        </button>
      </form>
    </div>
  );
}

const REVIEW_GROUPS: { id: string; label: string; flag: string }[] = [
  { id: "mga", label: "MGA", flag: "🇲🇹" },
  { id: "emta", label: "EMTA", flag: "🇪🇪" },
  { id: "curacao", label: "Curaçao", flag: "🇨🇼" },
  { id: "anjouan", label: "Anjouan", flag: "🏝️" },
];

type ReviewExtra = { title: string; content: string };
type ReviewForm = {
  slug: string;
  name: string;
  title: string;
  license: string;
  license_flag: string;
  license_tax_note: string;
  license_group: string;
  payment_methods: string;
  welcome_bonus: string;
  games: string;
  withdrawals: string;
  support: string;
  logo_url: string | null;
  extras: ReviewExtra[];
  pros: string[];
  cons: string[];
  display_order: number;
  published: boolean;
};

const emptyReview: ReviewForm = {
  slug: "",
  name: "",
  title: "",
  license: "",
  license_flag: "🇲🇹",
  license_tax_note: "",
  license_group: "mga",
  payment_methods: "",
  welcome_bonus: "",
  games: "",
  withdrawals: "",
  support: "",
  logo_url: null,
  extras: [],
  pros: [],
  cons: [],
  display_order: 100,
  published: true,
};

function ReviewsPanel() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () =>
      (await supabase.from("casino_reviews").select("*").order("license_group").order("display_order")).data ?? [],
  });
  const [form, setForm] = useState<ReviewForm>(emptyReview);
  const [editing, setEditing] = useState<string | null>(null);
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [fetchingLogos, setFetchingLogos] = useState(false);
  const fetchLogo = useServerFn(fetchCasinoLogo);

  const fetchOneLogo = async (id: string, name: string) => {
    try {
      const { logo_url } = await fetchLogo({ data: { name } });
      if (!logo_url) return toast.error(`Ei löytynyt: ${name}`);
      const { error } = await supabase.from("casino_reviews").update({ logo_url }).eq("id", id);
      if (error) throw error;
      toast.success(`Logo päivitetty: ${name}`);
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews-list"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Virhe");
    }
  };

  const fetchAllMissingLogos = async () => {
    const missing = rows.filter((r) => !r.logo_url);
    if (missing.length === 0) return toast.info("Kaikilla arvosteluilla on jo logo");
    if (!confirm(`Haetaan logot ${missing.length} arvostelulle netistä. Jatketaanko?`)) return;
    setFetchingLogos(true);
    let ok = 0;
    let fail = 0;
    for (const r of missing) {
      try {
        const { logo_url } = await fetchLogo({ data: { name: r.name } });
        if (logo_url) {
          await supabase.from("casino_reviews").update({ logo_url }).eq("id", r.id);
          ok++;
        } else fail++;
      } catch {
        fail++;
      }
    }
    setFetchingLogos(false);
    toast.success(`Valmis: ${ok} päivitetty, ${fail} epäonnistui`);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews-list"] });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      license_tax_note: form.license_tax_note || null,
      extras: form.extras,
    };
    const { error } = editing
      ? await supabase.from("casino_reviews").update(payload).eq("id", editing)
      : await supabase.from("casino_reviews").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Tallennettu");
    setForm(emptyReview);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews-list"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Poistetaanko arvostelu?")) return;
    const { error } = await supabase.from("casino_reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Poistettu");
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews-list"] });
  };

  const togglePublished = async (id: string, published: boolean) => {
    await supabase.from("casino_reviews").update({ published: !published }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews-list"] });
  };

  const startEdit = (r: typeof rows[number]) => {
    setEditing(r.id);
    setForm({
      slug: r.slug,
      name: r.name,
      title: r.title,
      license: r.license ?? "",
      license_flag: r.license_flag ?? "",
      license_tax_note: r.license_tax_note ?? "",
      license_group: r.license_group ?? "mga",
      payment_methods: r.payment_methods ?? "",
      welcome_bonus: r.welcome_bonus ?? "",
      games: r.games ?? "",
      withdrawals: r.withdrawals ?? "",
      support: r.support ?? "",
      logo_url: r.logo_url ?? null,
      extras: (Array.isArray(r.extras) ? r.extras : []) as ReviewExtra[],
      pros: r.pros ?? [],
      cons: r.cons ?? [],
      display_order: r.display_order ?? 100,
      published: r.published ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = filterGroup === "all" ? rows : rows.filter((r) => r.license_group === filterGroup);

  const setExtra = (i: number, patch: Partial<ReviewExtra>) => {
    const next = form.extras.slice();
    next[i] = { ...next[i], ...patch };
    setForm({ ...form, extras: next });
  };

  return (
    <>
      <form onSubmit={save} className="bg-surface gold-border rounded-xl p-5 grid md:grid-cols-2 gap-3 mb-8">
        <h2 className="md:col-span-2 font-display text-2xl text-gold">
          {editing ? `Muokkaa arvostelua: ${form.name}` : "Lisää uusi arvostelu"}
        </h2>

        <div className="md:col-span-2">
          <ImageUpload
            bucket="casino-logos"
            value={form.logo_url}
            onChange={(url) => setForm({ ...form, logo_url: url })}
            label="Kasinon logo"
          />
        </div>

        <input className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Nimi" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Slug (esim. pelikaani)" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Otsikko (sivulla näkyvä H1)" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <select className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" value={form.license_group} onChange={(e) => setForm({ ...form, license_group: e.target.value })}>
          {REVIEW_GROUPS.map((g) => (<option key={g.id} value={g.id}>{g.flag} {g.label}</option>))}
        </select>
        <input className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Lisenssin lippu (esim. 🇲🇹)" value={form.license_flag} onChange={(e) => setForm({ ...form, license_flag: e.target.value })} />
        <input className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Lisenssin teksti" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} />
        <input className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Lisenssin verohuomautus (valinnainen)" value={form.license_tax_note} onChange={(e) => setForm({ ...form, license_tax_note: e.target.value })} />

        <textarea rows={2} className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Maksutavat" value={form.payment_methods} onChange={(e) => setForm({ ...form, payment_methods: e.target.value })} />
        <textarea rows={3} className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Tervetuliaisbonus" value={form.welcome_bonus} onChange={(e) => setForm({ ...form, welcome_bonus: e.target.value })} />
        <textarea rows={2} className="md:col-span-2 bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Pelivalikoima" value={form.games} onChange={(e) => setForm({ ...form, games: e.target.value })} />
        <input className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Kotiutukset" value={form.withdrawals} onChange={(e) => setForm({ ...form, withdrawals: e.target.value })} />
        <input className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Asiakaspalvelu" value={form.support} onChange={(e) => setForm({ ...form, support: e.target.value })} />

        <div className="md:col-span-2 bg-background/50 rounded-lg p-3 border border-[color:var(--gold)]/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm uppercase text-gold">Lisäosiot (extras)</div>
            <button type="button" onClick={() => setForm({ ...form, extras: [...form.extras, { title: "", content: "" }] })} className="text-xs px-2 py-1 border border-[color:var(--gold)]/40 rounded">+ Lisää osio</button>
          </div>
          {form.extras.map((ex, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_2fr_auto] gap-2">
              <input className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Otsikko" value={ex.title} onChange={(e) => setExtra(i, { title: e.target.value })} />
              <textarea rows={2} className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Sisältö" value={ex.content} onChange={(e) => setExtra(i, { content: e.target.value })} />
              <button type="button" onClick={() => setForm({ ...form, extras: form.extras.filter((_, j) => j !== i) })} className="text-xs text-[color:var(--danger)] underline">Poista</button>
            </div>
          ))}
        </div>

        <div className="bg-background/50 rounded-lg p-3 border border-[color:var(--gold)]/20">
          <StringListInput label="Plussat" value={form.pros} onChange={(pros) => setForm({ ...form, pros })} placeholder="Esim. Nopeat kotiutukset" accentClass="text-[color:var(--success)]" />
        </div>
        <div className="bg-background/50 rounded-lg p-3 border border-[color:var(--gold)]/20">
          <StringListInput label="Miinukset" value={form.cons} onChange={(cons) => setForm({ ...form, cons })} placeholder="Esim. Suppea pelivalikoima" accentClass="text-[color:var(--danger)]" />
        </div>

        <input type="number" className="bg-background border border-[color:var(--gold)]/30 rounded px-3 py-2" placeholder="Järjestys" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Julkaistu (näkyy sivustolla)
        </label>

        <div className="md:col-span-2 flex gap-2">
          <button className="flex-1 px-4 py-2.5 gradient-gold text-background font-bold uppercase rounded">{editing ? "Päivitä" : "Lisää arvostelu"}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(emptyReview); }} className="px-4 py-2.5 border border-[color:var(--gold)]/40 rounded text-sm uppercase">Peruuta</button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilterGroup("all")} className={`text-xs px-3 py-1.5 rounded-full border ${filterGroup === "all" ? "bg-[color:var(--gold)] text-background border-[color:var(--gold)]" : "border-[color:var(--gold)]/40 text-gold"}`}>Kaikki ({rows.length})</button>
        {REVIEW_GROUPS.map((g) => {
          const n = rows.filter((r) => r.license_group === g.id).length;
          return (
            <button key={g.id} onClick={() => setFilterGroup(g.id)} className={`text-xs px-3 py-1.5 rounded-full border ${filterGroup === g.id ? "bg-[color:var(--gold)] text-background border-[color:var(--gold)]" : "border-[color:var(--gold)]/40 text-gold"}`}>{g.flag} {g.label} ({n})</button>
          );
        })}
        <button
          onClick={fetchAllMissingLogos}
          disabled={fetchingLogos}
          className="ml-auto text-xs px-3 py-1.5 rounded-full border border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-gold disabled:opacity-50"
        >
          {fetchingLogos ? "Haetaan…" : "🔎 Hae puuttuvat logot netistä"}
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map((r) => (
          <div key={r.id} className="bg-surface gold-border rounded p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded bg-background/60 border border-[color:var(--gold)]/20 p-1 flex items-center justify-center shrink-0">
                {r.logo_url ? (
                  <img src={r.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">Ei logoa</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold truncate">
                  {r.license_flag} {r.name}{" "}
                  {!r.published && <span className="text-[10px] text-muted-foreground ml-1">(luonnos)</span>}
                </div>
                <div className="text-muted-foreground text-xs truncate">/{r.slug} · {r.license_group}</div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0 text-xs">
              <a href={`/arvostelut/${r.slug}`} className="text-gold underline" target="_blank" rel="noreferrer">Avaa</a>
              <button onClick={() => fetchOneLogo(r.id, r.name)} className="text-gold underline">Hae logo</button>
              <button onClick={() => togglePublished(r.id, r.published)} className="text-gold underline">{r.published ? "Piilota" : "Julkaise"}</button>
              <button onClick={() => startEdit(r)} className="text-gold underline">Muokkaa</button>
              <button onClick={() => remove(r.id)} className="text-[color:var(--danger)] underline">Poista</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">Ei arvosteluja tällä suodattimella.</p>}
      </div>
    </>
  );
}
