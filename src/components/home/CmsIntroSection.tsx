import { PageContent } from "@/components/PageContent";
import { usePage } from "@/lib/cms";

/** CMS-hallittu intro-teksti (slug: etusivu). */
export function CmsIntroSection() {
  const { data: cmsPage } = usePage("etusivu");
  if (!cmsPage?.content) return null;
  return (
    <section className="container mx-auto px-4 mt-8 max-w-4xl">
      <PageContent html={cmsPage.content} />
    </section>
  );
}