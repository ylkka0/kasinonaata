import { usePage } from "@/lib/cms";
import { PageContent } from "@/components/PageContent";

/**
 * Renders CMS content for a given slug below an existing page's hard-coded
 * content. Admin can add/remove text and shortcode blocks per page via the
 * admin Pages panel. Renders nothing if the page row is missing or empty.
 */
export function CmsExtra({ slug, className }: { slug: string; className?: string }) {
  const { data: page } = usePage(slug);
  const html = (page?.content ?? "").trim();
  if (!html) return null;
  return (
    <div className={className ?? "container mx-auto px-4 pb-12 max-w-4xl"}>
      <PageContent html={html} />
    </div>
  );
}