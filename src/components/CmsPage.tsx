import { Layout } from "@/components/Layout";
import { PageContent } from "@/components/PageContent";
import { usePage } from "@/lib/cms";

/**
 * Renders a CMS-managed page by slug. Children render BELOW the CMS content
 * — useful for pages that need a custom interactive section (e.g. a form).
 */
export function CmsPage({
  slug,
  fallbackTitle,
  breadcrumb,
  children,
}: {
  slug: string;
  fallbackTitle: string;
  breadcrumb?: string;
  children?: React.ReactNode;
}) {
  const { data: page, isLoading } = usePage(slug);
  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <nav className="text-xs text-muted-foreground mb-3">
          <a href="/" className="hover:text-gold">Etusivu</a> / {breadcrumb ?? page?.title ?? fallbackTitle}
        </nav>
        <h1 className="font-display text-5xl mb-6">{page?.title ?? fallbackTitle}</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Ladataan…</p>
        ) : (
          <div className="max-w-4xl">
            <PageContent html={page?.content ?? ""} />
          </div>
        )}
        {children}
      </section>
    </Layout>
  );
}