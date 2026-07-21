import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "@/assets/marten-logo.png";
import { PAYMENT_METHODS } from "@/components/home/constants";
import { DEFAULT_HEADER, useSiteSetting, type HeaderGroup, type HeaderItem, type HeaderSettings } from "@/lib/cms";

const paymentHrefByLabel = new Map(
  PAYMENT_METHODS.map((method) => [method.name.toLowerCase(), `/maksutavat/${method.slug}`]),
);

function normalizeItem(groupLabel: string, item: HeaderItem): HeaderItem {
  const group = groupLabel.toLowerCase();
  const label = item.label.toLowerCase();

  if (group === "uutiset") {
    if (label === "uudet kasinot") return { ...item, href: "/uutiset/uudet-kasinot" };
    if (label === "artikkelit") return { ...item, href: "/blogi" };
  }

  if (group === "maksutavat") {
    const href = paymentHrefByLabel.get(label);
    if (href) return { ...item, href };
  }

  return item;
}

function normalizeGroups(settings: HeaderSettings): HeaderGroup[] {
  return (settings.groups ?? [])
    .filter((group) => group.href !== "/oppaat" && group.href !== "/uutiset/alan-paivitykset")
    .map((group) => {
      if (group.label.toLowerCase() === "arvostelut") {
        return { label: group.label, href: "/arvostelut" };
      }

      const items = group.items
        ?.filter((item) => !["/oppaat", "/uutiset/alan-paivitykset"].includes(item.href))
        .map((item) => normalizeItem(group.label, item));

      return { ...group, items };
    })
    .filter((group) => group.href || (group.items && group.items.length > 0));
}

export function Header() {
  const settings = useSiteSetting<HeaderSettings>("header", DEFAULT_HEADER);
  const groups = normalizeGroups(settings);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenIdx(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpenIdx(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-[color:var(--gold)]/20">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Kasinonäätä" width={48} height={48} className="rounded-full gold-glow transition-transform group-hover:rotate-6" />
          <div className="leading-none">
            <div className="font-display text-2xl tracking-wide text-foreground">
              <span className="text-white">{settings.logo_text ?? "Kasinonäätä"}</span>
              {settings.logo_sub && <span className="text-white">{settings.logo_sub}</span>}
            </div>
          </div>
        </Link>

        <nav ref={navRef} className="hidden lg:flex items-center gap-1">
          {groups.map((g, i) =>
            g.items ? (
              <div key={g.label} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-md text-foreground/85 hover:text-gold hover:bg-surface"
                >
                  {g.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
                </button>
                {openIdx === i && (
                  <div className="absolute top-full left-0 min-w-[240px] bg-surface gold-border rounded-lg shadow-2xl py-2 mt-1 z-50">
                    {g.items.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        onClick={() => setOpenIdx(null)}
                        className="flex items-center justify-between px-4 py-2 text-sm hover:bg-surface-2 hover:text-gold"
                      >
                        {s.label}
                        {s.badge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[color:var(--gold)] text-background font-bold">{s.badge}</span>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={g.label}
                href={g.href!}
                className="px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-md transition-colors text-foreground/85 hover:text-gold hover:bg-surface"
              >
                {g.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button className="lg:hidden p-2 text-gold" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Avaa valikko">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[color:var(--gold)]/20 bg-background/95">
          <div className="container mx-auto px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
            {groups.map((g) => (
              <div key={g.label}>
                {g.items ? (
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-2 font-semibold uppercase tracking-wider text-sm text-foreground/85">
                      {g.label}
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="pl-4 py-1 space-y-1">
                      {g.items.map((s) => (
                        <a key={s.label} href={s.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-foreground/75 hover:text-gold">
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a href={g.href!} onClick={() => setMobileOpen(false)} className="block py-2 font-semibold uppercase tracking-wider text-sm text-foreground/85">
                    {g.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
