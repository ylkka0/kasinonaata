import { Link } from "@tanstack/react-router";
import { PAYMENT_METHODS } from "./constants";

/** Maksutapaverkko-osio. */
export function PaymentMethodsSection() {
  return (
    <section id="maksutavat" className="container mx-auto px-4 py-16 border-t border-[color:var(--gold)]/15 scroll-mt-24">
      <h2 className="font-display text-4xl mb-8 text-center">Kasinot suosituimmilla maksutavoilla</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PAYMENT_METHODS.map((p) => (
          <Link key={p.name} to="/maksutavat/$slug" params={{ slug: p.slug }} className="block bg-surface gold-border rounded-xl p-5 text-center hover:bg-[color:var(--gold)]/10 transition">
            <div className="font-display text-2xl text-gold">{p.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{p.count}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
