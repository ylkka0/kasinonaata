import { Link } from "@tanstack/react-router";
import logo from "@/assets/marten-logo.png";
import {
  useSiteSetting,
  DEFAULT_FOOTER,
  DEFAULT_HEADER,
  type FooterSettings,
  type HeaderSettings,
} from "@/lib/cms";
import { useT } from "@/lib/i18n";

export function Footer() {
  const f = useSiteSetting<FooterSettings>("footer", DEFAULT_FOOTER);
  const h = useSiteSetting<HeaderSettings>("header", DEFAULT_HEADER);
  const headerGroups = (h.groups ?? [])
    .map((group) => ({
      ...group,
      items: group.items?.filter((item) => !["/oppaat", "/uutiset/alan-paivitykset"].includes(item.href)),
    }))
    .filter((group) => group.href !== "/oppaat" && group.href !== "/uutiset/alan-paivitykset" && (!group.items || group.items.length > 0));
  const t = useT();
  return (
    <footer className="mt-24 border-t border-[color:var(--gold)]/20 bg-surface">
      <div className="suit-divider py-4">♠ ♥ ♦ ♣</div>
      <div className="container mx-auto px-4 pt-10 pb-6 flex flex-col items-center text-center">
        <img
          src={logo}
          alt="Kasinonäätä"
          width={160}
          height={160}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full gold-glow"
        />
        <div className="mt-4 font-display text-4xl md:text-5xl text-white leading-none">
          Kasinonäätä
        </div>
        {f.subtitle && (
          <div className="mt-2 text-sm text-muted-foreground italic">{f.subtitle}</div>
        )}
        {f.tagline && (
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">{f.tagline}</p>
        )}
      </div>
      <div className="container mx-auto px-4 pb-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {headerGroups.map((g) => (
          <div key={g.label}>
            <h3 className="text-xs uppercase tracking-widest text-gold mb-3">{g.label}</h3>
            <ul className="space-y-1.5 text-sm text-foreground/75">
              {g.items && g.items.length > 0 ? (
                g.items.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="hover:text-gold">{s.label}</a>
                  </li>
                ))
              ) : g.href ? (
                <li>
                  <a href={g.href} className="hover:text-gold">{g.label}</a>
                </li>
              ) : null}
            </ul>
          </div>
        ))}
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
          <h3 className="text-xs uppercase tracking-widest text-gold mb-3">{t("footer.responsible")}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 border-2 border-[color:var(--gold)] rounded font-display text-gold text-lg leading-none">18+</span>
            <span className="text-xs text-muted-foreground">{t("footer.adultsOnly")}</span>
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
