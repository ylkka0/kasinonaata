import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { CmsExtra } from "@/components/CmsExtra";
import { pick, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/blogi")({
  head: () => ({
    meta: [
      { title: "Blogi – Kasinonäätä" },
      { name: "description", content: "Näädän kasinoblogi: vinkit, uutiset, strategiat ja kasinoarvostelut." },
    ],
  }),
  component: BlogList,
});

function BlogList() {
  const { lang } = useLang();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-display text-5xl mb-2">Näädän blogi</h1>
        <p className="text-muted-foreground mb-10">Vinkit, uutiset ja kasinoarvostelut.</p>

        {isLoading && <p>Ladataan...</p>}
        {!isLoading && posts.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">Ei vielä artikkeleita. Palaa kohta uudestaan.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blogi/$slug"
              params={{ slug: p.slug }}
              className="bg-surface gold-border rounded-xl overflow-hidden hover:gold-glow transition-shadow group"
            >
              {p.cover_image_url && (
                <img src={p.cover_image_url} alt={p.cover_image_alt ?? p.title} className="w-full h-48 object-cover" loading="lazy" />
              )}
              <div className="p-5">
                {p.tags && p.tags.length > 0 && (
                  <div className="text-[11px] uppercase tracking-wider text-gold mb-2">{p.tags[0]}</div>
                )}
                <h2 className="font-display text-2xl group-hover:text-gold mb-2 leading-tight">{pick(lang, p.title, (p as any).title_en)}</h2>
                {(p.excerpt || (p as any).excerpt_en) && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{pick(lang, p.excerpt, (p as any).excerpt_en)}</p>
                )}
                <div className="text-xs text-muted-foreground mt-3">{p.author} · {p.published_at && new Date(p.published_at).toLocaleDateString(lang === "en" ? "en-GB" : "fi-FI")}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CmsExtra slug="blogi" />
    </Layout>
  );
}