import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Blogi-osio etusivulle. Listaa uusimmat julkaistut artikkelit
 * (max 6) "vapaamuotoinen artikkeli" -tyylisellä korttinäkymällä.
 * Ankkuri: #blogi (käytetään navigaatiopalkin BLOGI-linkissä).
 */
export function BlogSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["home-blog-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, cover_image_alt, tags, author, published_at")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .order("published_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
    staleTime: 60_000,
  });

  return (
    <section
      id="blogi"
      className="container mx-auto px-4 py-16 border-t border-[color:var(--gold)]/15 scroll-mt-24"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-2">Näädän blogi</div>
          <h2 className="font-display text-4xl md:text-5xl">Artikkelit</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Vinkkejä, uutisia ja syvempiä katsauksia kasinomaailmaan. Näädän omasta kynästä.
          </p>
        </div>
        <Link
          to="/blogi"
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[color:var(--gold)]/40 text-gold text-sm font-semibold uppercase tracking-wider hover:bg-surface"
        >
          Kaikki artikkelit →
        </Link>
      </div>

      {isLoading && <p className="text-muted-foreground">Ladataan…</p>}
      {!isLoading && posts.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">
          Ei vielä artikkeleita. Palaa kohta uudestaan.
        </p>
      )}

      {posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
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
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5 flex-1 flex flex-col">
                {p.tags && p.tags.length > 0 && (
                  <div className="text-[11px] uppercase tracking-wider text-gold mb-2">
                    {p.tags[0]}
                  </div>
                )}
                <h3 className="font-display text-2xl group-hover:text-gold mb-2 leading-tight">
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                )}
                <div className="text-xs text-muted-foreground mt-auto pt-3">
                  {p.author}
                  {p.published_at && (
                    <> · {new Date(p.published_at).toLocaleDateString("fi-FI")}</>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}