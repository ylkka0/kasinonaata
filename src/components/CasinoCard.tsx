import { Link } from "@tanstack/react-router";
import type { Database } from "@/integrations/supabase/types";
import martenLogo from "@/assets/marten-logo.png";

type Casino = Database["public"]["Tables"]["casinos"]["Row"];

function Stars({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2);
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${rating}/10`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < stars ? "" : "opacity-25"}>★</span>
      ))}
    </div>
  );
}

export function CasinoCard({ casino, rank, compact = false }: { casino: Casino; rank?: number; compact?: boolean }) {
  if (compact) {
    return (
      <article className="relative bg-surface gold-border rounded-xl p-3 hover:gold-glow transition-shadow group">
        {rank && (
          <div className="absolute -top-2 -left-2 w-7 h-7 text-sm rounded-full gradient-gold text-background font-display flex items-center justify-center shadow-lg">
            {rank}
          </div>
        )}
        <div className="flex gap-3 items-center">
          {casino.logo_url && (
            <img
              src={casino.logo_url}
              alt={casino.logo_alt ?? casino.name}
              width={48}
              height={48}
              loading="lazy"
              className="w-12 h-12 rounded-lg object-contain bg-background/60 p-1 shrink-0"
            />
          )}

          <div className="min-w-0 flex-1">
            <Link to="/kasinot/$slug" params={{ slug: casino.slug }} className="block">
              <h3 className="font-display text-base leading-tight tracking-wide truncate hover:text-gold">{casino.name}</h3>
            </Link>
            <div className="flex items-center gap-2">
              <Stars rating={Number(casino.rating)} />
              <span className="text-gold font-display text-sm leading-none">{Number(casino.rating).toFixed(1)}<span className="text-muted-foreground text-[10px]">/10</span></span>
            </div>
            {casino.bonus_text && (
              <div className="mt-1 text-xs line-clamp-2">
                <span className="text-[10px] uppercase tracking-widest text-gold mr-1">Bonus:</span>
                <span className="font-semibold text-foreground">{casino.bonus_text}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 shrink-0 w-[88px]">
            <a
              href={casino.affiliate_link ?? "#"}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="text-center px-3 py-1.5 text-xs rounded-lg font-bold uppercase tracking-wider bg-[color:var(--success)] text-background hover:opacity-90 transition-opacity"
            >
              Pelaa →
            </a>
            <Link
              to="/kasinot/$slug"
              params={{ slug: casino.slug }}
              className="text-center px-3 py-1.5 text-xs rounded-lg font-semibold uppercase tracking-wider border border-[color:var(--gold)]/40 text-gold hover:bg-surface-2"
            >
              Lue
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`relative bg-surface gold-border rounded-xl ${compact ? "p-3 md:p-4" : "p-5"} hover:gold-glow transition-shadow group`}>
      {rank && (
        <div className={`absolute ${compact ? "-top-2 -left-2 w-7 h-7 text-sm" : "-top-3 -left-3 w-10 h-10 text-xl"} rounded-full gradient-gold text-background font-display flex items-center justify-center shadow-lg`}>
          {rank}
        </div>
      )}
      <div className={`flex items-start justify-between gap-4 ${compact ? "mb-2" : "mb-3"}`}>
        <div className="flex items-center gap-3 min-w-0">
          {casino.logo_url && (
            <img
              src={casino.logo_url}
              alt={casino.logo_alt ?? casino.name}
              width={compact ? 40 : 56}
              height={compact ? 40 : 56}
              loading="lazy"
              className={`${compact ? "w-10 h-10" : "w-14 h-14"} rounded-lg object-contain bg-background/60 p-1 shrink-0`}
            />
          )}
          <div className="min-w-0">
            <Link to="/kasinot/$slug" params={{ slug: casino.slug }} className="block">
              <h3 className={`font-display ${compact ? "text-lg" : "text-2xl"} tracking-wide truncate hover:text-gold`}>{casino.name}</h3>
            </Link>
            <Stars rating={Number(casino.rating)} />
          </div>
        </div>
        <div className="flex flex-col items-center text-center shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Näädän</div>
          <div className={`font-display ${compact ? "text-2xl" : "text-3xl"} text-gold leading-none`}>{Number(casino.rating).toFixed(1)}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 10</div>
        </div>
      </div>

      {casino.bonus_text && (
        <div className={`bg-background/60 rounded-lg ${compact ? "p-2 mb-2" : "p-3 mb-3"}`}>
          <div className="text-[10px] uppercase tracking-widest text-gold">Bonus</div>
          <div className={`font-semibold text-foreground ${compact ? "text-sm" : ""}`}>{casino.bonus_text}</div>
        </div>
      )}

      {casino.tags && casino.tags.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${compact ? "mb-2" : "mb-4"}`}>
          {casino.tags.slice(0, compact ? 3 : casino.tags.length).map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full border border-[color:var(--gold)]/30 text-gold/90">
              {tag}
            </span>
          ))}
        </div>
      )}

      {!compact && ((casino.pros && casino.pros.length > 0) || (casino.cons && casino.cons.length > 0)) && (
        <div className="bg-background/40 rounded-lg p-3 mb-3">
          <div className="text-[11px] uppercase tracking-widest text-gold mb-2 font-bold">Plussat & Miinukset</div>
          <ul className="space-y-1 text-sm">
            {casino.pros?.slice(0, 4).map((p, i) => (
              <li key={`p-${i}`} className="flex gap-2">
                <span className="text-[color:var(--success)] font-bold shrink-0">＋</span>
                <span className="leading-snug">{p}</span>
              </li>
            ))}
            {casino.cons?.slice(0, 2).map((c, i) => (
              <li key={`c-${i}`} className="flex gap-2">
                <span className="text-[color:var(--danger)] font-bold shrink-0">－</span>
                <span className="leading-snug">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {compact && ((casino.pros && casino.pros.length > 0) || (casino.cons && casino.cons.length > 0)) && (
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
          <ul className="space-y-0.5">
            {casino.pros?.slice(0, 3).map((p, i) => (
              <li key={`p-${i}`} className="flex gap-1.5">
                <span className="text-[color:var(--success)] font-bold shrink-0 leading-snug">＋</span>
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-0.5">
            {casino.cons?.slice(0, 3).map((c, i) => (
              <li key={`c-${i}`} className="flex gap-1.5">
                <span className="text-[color:var(--danger)] font-bold shrink-0 leading-snug">－</span>
                <span className="leading-snug">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <a
          href={casino.affiliate_link ?? "#"}
          target="_blank"
          rel="nofollow sponsored noopener"
          className={`flex-1 text-center ${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"} rounded-lg font-bold uppercase tracking-wider bg-[color:var(--success)] text-background hover:opacity-90 transition-opacity`}
        >
          Pelaa nyt →
        </a>
        <Link
          to="/kasinot/$slug"
          params={{ slug: casino.slug }}
          className={`${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"} rounded-lg font-semibold uppercase tracking-wider border border-[color:var(--gold)]/40 text-gold hover:bg-surface-2`}
        >
          Lue
        </Link>
      </div>

      {!compact && (
      <div className="flex items-start gap-2 mt-3 px-3 py-2 bg-background/40 rounded-md border-l-2 border-[color:var(--gold)]/40">
        <img src={martenLogo} alt="" width={28} height={28} className="rounded-full shrink-0" />
        <div className="text-xs italic text-muted-foreground">
          <span className="not-italic font-semibold text-gold">Näädän arvio:</span>{" "}
          {casino.review_text?.slice(0, 90) ?? `Testattu — ${casino.avg_withdrawal_minutes ? `kotiutus n. ${casino.avg_withdrawal_minutes} min.` : "luotettava valinta."}`}
        </div>
      </div>
      )}

      <div className={`text-[10px] text-muted-foreground/70 ${compact ? "mt-1.5" : "mt-2"} text-center`}>
        18+ · Vain uusille pelaajille · T&amp;C voimassa · Pelaa vastuullisesti
      </div>
    </article>
  );
}
