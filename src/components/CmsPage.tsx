import { Layout } from "@/components/Layout";
import { PageContent } from "@/components/PageContent";
import { usePage, localizedPage } from "@/lib/cms";
import { useLang, useT } from "@/lib/i18n";

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
  const { lang } = useLang();
  const t = useT();
  const p = localizedPage(page, lang);
  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <nav className="text-xs text-muted-foreground mb-3">
          <a href="/" className="hover:text-gold">{t("common.home")}</a> / {breadcrumb ?? p?.title ?? fallbackTitle}
        </nav>
        <h1 className="font-display text-5xl mb-6">{p?.title ?? fallbackTitle}</h1>
        {isLoading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : (
          <div className="max-w-4xl">
            <PageContent html={p?.content ?? ""} />
          </div>
        )}
        {children}
      </section>
    </Layout>
  );
}