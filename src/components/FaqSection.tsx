import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  /** Optional explicit page key. Defaults to current pathname. */
  pageKey?: string;
  /** Heading shown above the FAQ (default: "Usein kysytyt kysymykset"). */
  title?: string;
};

export function FaqSection({ pageKey, title = "Usein kysytyt kysymykset" }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const key = (pageKey ?? pathname).replace(/\/+$/, "") || "/";

  const { data: faqs = [] } = useQuery({
    queryKey: ["faqs", key],
    queryFn: async () => {
      const { data } = await supabase
        .from("faqs")
        .select("id,question,answer,display_order")
        .eq("page_key", key)
        .eq("published", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  if (faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="container mx-auto px-4 py-12 max-w-3xl">
      <h2 className="font-display text-3xl md:text-4xl text-gold mb-6 text-center">{title}</h2>
      <Accordion type="single" collapsible className="bg-surface gold-border rounded-xl px-4">
        {faqs.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="border-b border-[color:var(--gold)]/15 last:border-0">
            <AccordionTrigger className="text-left font-semibold hover:text-gold py-4">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="text-foreground/85 leading-relaxed pb-4 whitespace-pre-line">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}