import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { CmsExtra } from "@/components/CmsExtra";
import jiriPhoto from "@/assets/jiri-kaartinen.png";

export const Route = createFileRoute("/kirjoittajat")({
  head: () => ({
    meta: [
      { title: "Kirjoittajat – Kasinonäätä" },
      {
        name: "description",
        content:
          "Tutustu Kasinonäädän kirjoittajiin ja iGaming-asiantuntijoihin.",
      },
    ],
  }),
  component: KirjoittajatPage,
});

function KirjoittajatPage() {
  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: async () =>
      (
        await supabase
          .from("authors")
          .select("*")
          .eq("published", true)
          .order("display_order", { ascending: true })
      ).data ?? [],
  });

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">Etusivu</Link>
          <span className="mx-2">/</span>
          <span>Toimitus</span>
          <span className="mx-2">/</span>
          <span className="text-gold">Kirjoittajat</span>
        </nav>

        <h1 className="font-display text-5xl mb-2">Kirjoittajat</h1>
        <p className="text-muted-foreground mb-10">
          Kasinonäädän tiimissä on alan ammattilaisia, joilla on vuosien
          kokemus rahapelialalta sekä pöydän että pelaajan puolelta.
        </p>

        <div className="space-y-8">
          {authors.map((a) => {
            const photo =
              a.photo_url && !a.photo_url.startsWith("/src/")
                ? a.photo_url
                : a.slug === "jiri-kaartinen"
                ? jiriPhoto
                : null;
            return (
              <article key={a.id} className="bg-surface gold-border rounded-2xl p-6 md:p-10">
                <header className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                  {photo && (
                    <img
                      src={photo}
                      alt={a.name}
                      width={140}
                      height={140}
                      className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover gold-border gold-glow"
                    />
                  )}
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl text-gold mb-1">
                      {a.name}
                    </h2>
                    {a.role && (
                      <p className="text-sm uppercase tracking-wider text-foreground/80 mb-2">
                        {a.role}
                      </p>
                    )}
                    {a.tagline && (
                      <p className="text-sm text-muted-foreground">{a.tagline}</p>
                    )}
                  </div>
                </header>
                {a.content && (
                  <div
                    className="prose prose-invert max-w-none space-y-4 text-foreground/90 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-[color:var(--gold)] [&_h3]:pt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: a.content }}
                  />
                )}
              </article>
            );
          })}
          {authors.length === 0 && (
            <p className="text-muted-foreground text-center py-10">
              Ei vielä kirjoittajia.
            </p>
          )}
        </div>
      </section>
      <CmsExtra slug="kirjoittajat" />
    </Layout>
  );
}
