import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Uutissyöte etusivulla — korvaa aiemmat TOP 10 / kategoria / bonus -osiot.
 * Näyttää uusimmat blog_posts -merkinnät korttiruudukkona.
 */
export function NewsFeedSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["home-news-feed"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, cover_image_alt, tags, author, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(12);
      return data ?? [];
    },
    staleTime: 60_000,
  });

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4 border-b border-[color:var(--gold)]/20 pb-3 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-1">Näädän toimitus</div>
          <h2 className="font-display text-3xl md:text-4xl">Uusimmat kasinouutiset</h2>
        </div>
        <Link
          to="/blogi"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[color:var(--gold)]/40 text-gold text-sm font-semibold uppercase tracking-wider hover:bg-surface"
        >
          Kaikki →
        </Link>
      </div>

      {isLoading && <p className="text-muted-foreground">Ladataan…</p>}
      {!isLoading && posts.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">Ei vielä uutisia.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4 flex-1 flex flex-col">
              {p.tags?.[0] && (
                <div className="text-[10px] uppercase tracking-wider text-gold mb-1">{p.tags[0]}</div>
              )}
              <h3 className="font-display text-lg group-hover:text-gold mb-2 leading-tight">{p.title}</h3>
              {p.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
              )}
              <div className="text-[11px] text-muted-foreground mt-auto pt-3">
                {p.published_at && new Date(p.published_at).toLocaleDateString("fi-FI")}
                {p.author && <> · {p.author}</>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}