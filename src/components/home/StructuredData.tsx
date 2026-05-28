import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CURRENT_YEAR, FAQ } from "./constants";

/** JSON-LD strukturoitu data SEO:ta varten. */
export function StructuredData() {
  const { data: casinos = [] } = useQuery({
    queryKey: ["casinos-top"],
    queryFn: async () => {
      const { data } = await supabase.from("casinos").select("*").order("ranking").limit(10);
      return data ?? [];
    },
  });
  const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", itemListElement: casinos.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `https://kasinonaata.fi/kasinot/${c.slug}` })) };
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const websiteLd = { "@context": "https://schema.org", "@type": "WebSite", name: "KasinoNäätä", url: "https://kasinonaata.fi", description: `Suomen rehellisimmin testatut nettikasinot ${CURRENT_YEAR}` };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
