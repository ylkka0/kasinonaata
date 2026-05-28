import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ } from "./constants";

/** Usein kysytyt kysymykset. */
export function FaqSection() {
  return (
    <section id="faq" className="container mx-auto px-4 py-16 border-t border-[color:var(--gold)]/15 scroll-mt-24">
      <h2 className="font-display text-4xl mb-6">Usein kysyttyä nettikasinoista</h2>
      <Accordion type="single" collapsible className="max-w-3xl">
        {FAQ.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
