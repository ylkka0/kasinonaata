import { Link } from "@tanstack/react-router";
import logo from "@/assets/marten-logo.png";
import { useSiteSetting, DEFAULT_FOOTER, type FooterSettings } from "@/lib/cms";

export function Footer() {
  const f = useSiteSetting<FooterSettings>("footer", DEFAULT_FOOTER);
  return (
    <footer className="mt-24 border-t border-[color:var(--gold)]/20 bg-surface">
      <div className="suit-divider py-4">♠ ♥ ♦ ♣</div>
      <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <img src={logo} alt="Kasinonäätä" width={64} height={64} className="rounded-full gold-glow" />
            <div>
              <div className="font-display text-2xl text-gold leading-none whitespace-pre-line text-white">{"\n"}Kasinonäätä</div>
              {f.subtitle && <div className="text-[11px] text-muted-foreground italic">{f.subtitle}</div>}
            </div>
          </div>
          {f.tagline && <p className="text-xs text-muted-foreground">{f.tagline}</p>}
        </div>
        {(f.columns ?? []).map((col) => (
          <div key={col.title}>
            <h3 className="text-xs uppercase tracking-widest text-gold mb-3">{col.title}</h3>
            <ul className="space-y-1.5 text-sm text-foreground/75">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noreferrer noopener" className="hover:text-gold">{l.label}</a>
                  ) : (
                    <a href={l.href} className="hover:text-gold">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gold mb-3">Vastuullisesti</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 border-2 border-[color:var(--gold)] rounded font-display text-gold text-lg leading-none">18+</span>
            <span className="text-xs text-muted-foreground">Vain täysi-ikäisille</span>
          </div>
          {f.responsible_text && <p className="text-xs text-muted-foreground">{f.responsible_text}</p>}
        </div>
      </div>
      <div className="border-t border-[color:var(--gold)]/10 py-4 text-center text-xs text-muted-foreground space-y-1">
        {f.copyright && <div>{f.copyright}</div>}
        <div className="opacity-70">{f.disclosure} · <Link to="/admin" className="hover:text-gold">Admin</Link></div>
      </div>
    </footer>
  );
}
