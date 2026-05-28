import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CasinoCard } from "@/components/CasinoCard";
import { CURRENT_MONTH, CURRENT_YEAR, FILTERS, UPDATED_DATE_SHORT } from "./constants";

/**
 * Rautalankamallin mukainen pääosio:
 *   Vasemmalla kapea TOP 10 -palsta (kasinokortit allekkain),
 *   oikealla isompi uutiset / blogi / artikkeliosio.
 */
export function NewsAndTop10Section() {
  const [filter, setFilter] = useState<string>("all");

  const { data: casinos = [] } = useQuery({
    queryKey: ["casinos-top"],
    queryFn: async () => {
      const { data, error } = await supabase.from("casinos").select("*").order("ranking").limit(10);
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    if (filter === "all") return casinos;
    return casinos.filter((c) => c.tags?.includes(filter));
  }, [casinos, filter]);

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ["home-news-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, cover_image_alt, tags, author, published_at")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .order("published_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
    staleTime: 60_000,
  });

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section id="top10" className="container mx-auto px-4 py-12 scroll-mt-24">
      <div className="grid lg:grid-cols-[360px_1fr] gap-8">
        {/* TOP 10 sidebar */}
        <aside className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold mb-1">Päivitetty {UPDATED_DATE_SHORT}</div>
            <h2 className="font-display text-3xl leading-tight">🏆 TOP 10 — {CURRENT_MONTH}</h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.slice(0, 4).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                  filter === f.id
                    ? "bg-[color:var(--gold)] text-background"
                    : "border border-[color:var(--gold)]/30 text-foreground/80 hover:bg-surface"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((c, i) => (
              <CasinoCard key={c.id} casino={c} rank={i + 1} compact />
            ))}
            {filtered.length === 0 && (
              <p className="text-muted-foreground text-center py-8 text-sm">Ei tuloksia.</p>
            )}
          </div>

          <Link
            to="/kasinot"
            className="block text-center px-4 py-2.5 rounded-lg border border-[color:var(--gold)]/40 text-gold font-bold uppercase tracking-wider text-xs hover:bg-surface"
          >
            Katso kaikki kasinot →
          </Link>
        </aside>

        {/* News / Blog main column */}
        <div id="blogi" className="space-y-8">
          <div className="flex items-end justify-between gap-4 border-b border-[color:var(--gold)]/20 pb-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-gold mb-1">Näädän toimitus</div>
              <h2 className="font-display text-2xl md:text-3xl">Uutiset & artikkelit</h2>
            </div>
            <Link
              to="/blogi"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[color:var(--gold)]/40 text-gold text-sm font-semibold uppercase tracking-wider hover:bg-surface"
            >
              Kaikki →
            </Link>
          </div>

          {loadingPosts && <p className="text-muted-foreground">Ladataan…</p>}
          {!loadingPosts && posts.length === 0 && (
            <p className="text-muted-foreground py-12 text-center">Ei vielä artikkeleita.</p>
          )}

          {featured && (
            <Link
              to="/blogi/$slug"
              params={{ slug: featured.slug }}
              className="block group bg-surface gold-border rounded-xl overflow-hidden hover:gold-glow transition-shadow"
            >
              <div className="grid md:grid-cols-[40%_60%]">
                {featured.cover_image_url && (
                  <img
                    src={featured.cover_image_url}
                    alt={featured.cover_image_alt ?? featured.title}
                    loading="lazy"
                    className="w-full h-48 md:h-full object-cover"
                  />
                )}
                <div className="p-5 flex flex-col">
                  {featured.tags?.[0] && (
                    <div className="text-[10px] uppercase tracking-wider text-gold mb-1">{featured.tags[0]}</div>
                  )}
                  <h3 className="font-display text-xl md:text-2xl leading-tight group-hover:text-gold mb-2">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{featured.excerpt}</p>
                  )}
                  <div className="text-xs text-muted-foreground mt-auto pt-3">
                    {featured.author}
                    {featured.published_at && (
                      <> · {new Date(featured.published_at).toLocaleDateString("fi-FI")}</>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((p) => (
                <Link
                  key={p.id}
                  to="/blogi/$slug"
                  params={{ slug: p.slug }}
                  className="bg-surface gold-border rounded-xl overflow-hidden hover:gold-glow transition-shadow group flex flex-col"
                >
                  {p.cover_image_url && (
                    <img
                      src={p.cover_image_url}
                      alt={p.cover_image_alt ?? p.title}
                      loading="lazy"
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-3 flex-1 flex flex-col">
                    {p.tags?.[0] && (
                      <div className="text-[10px] uppercase tracking-wider text-gold mb-1">{p.tags[0]}</div>
                    )}
                    <h3 className="font-display text-base group-hover:text-gold mb-1 leading-tight">{p.title}</h3>
                    {p.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
                    )}
                    <div className="text-[11px] text-muted-foreground mt-auto pt-2">
                      {p.author}
                      {p.published_at && <> · {new Date(p.published_at).toLocaleDateString("fi-FI")}</>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center sm:hidden">
            <Link
              to="/blogi"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[color:var(--gold)]/40 text-gold text-sm font-semibold uppercase tracking-wider hover:bg-surface"
            >
              Kaikki artikkelit →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
