import { useQuery } from "@tanstack/react-query";
import { Fragment, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CasinoCard } from "@/components/CasinoCard";
import DOMPurify from "isomorphic-dompurify";

/**
 * Renders HTML content from the CMS with shortcode support.
 * Supported shortcodes (must be on their own — replaced as block):
 *   [casinos limit=5]   – list of top casinos
 *   [bonus_alerts]      – active bonus alerts banner list
 */

function CasinoListBlock({ limit }: { limit: number }) {
  const { data: casinos = [] } = useQuery({
    queryKey: ["page-casinos", limit],
    queryFn: async () => {
      const { data } = await supabase
        .from("casinos")
        .select("*")
        .order("ranking")
        .limit(limit);
      return data ?? [];
    },
  });
  return (
    <div className="space-y-4 my-6">
      {casinos.map((c, i) => (
        <CasinoCard key={c.id} casino={c} rank={i + 1} />
      ))}
    </div>
  );
}

function BonusAlertsBlock() {
  const { data: alerts = [] } = useQuery({
    queryKey: ["page-bonus-alerts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bonus_alerts")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  if (alerts.length === 0) return null;
  return (
    <div className="space-y-3 my-6">
      {alerts.map((a) => (
        <div key={a.id} className="bg-gradient-to-r from-[color:var(--gold)]/15 to-transparent border border-[color:var(--gold)]/40 rounded-lg p-4 flex items-center gap-4">
          <span className="text-2xl">⚡</span>
          <div className="flex-1">
            <div className="font-bold text-gold">{a.title}</div>
            {a.description && <div className="text-sm text-muted-foreground">{a.description}</div>}
          </div>
          {a.affiliate_link && (
            <a href={a.affiliate_link} target="_blank" rel="noreferrer noopener sponsored" className="px-4 py-2 gradient-gold text-background font-bold uppercase rounded text-sm whitespace-nowrap">
              Aktivoi
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

const SHORTCODE_RE = /\[(casinos|bonus_alerts)(\s+[^\]]*)?\]/g;

function parseAttrs(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const m of raw.matchAll(/(\w+)=([\w]+|"[^"]*")/g)) {
    out[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return out;
}

export function PageContent({ html }: { html: string }) {
  const parts: ReactNode[] = [];
  let lastIdx = 0;
  let key = 0;
  for (const m of html.matchAll(SHORTCODE_RE)) {
    const start = m.index ?? 0;
    if (start > lastIdx) {
      parts.push(
        <div
          key={`h-${key++}`}
          className="cms-html"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html.slice(lastIdx, start)) }}
        />
      );
    }
    const name = m[1];
    const attrs = parseAttrs(m[2]);
    if (name === "casinos") {
      parts.push(
        <CasinoListBlock key={`b-${key++}`} limit={Number(attrs.limit ?? 5) || 5} />
      );
    } else if (name === "bonus_alerts") {
      parts.push(<BonusAlertsBlock key={`b-${key++}`} />);
    }
    lastIdx = start + m[0].length;
  }
  if (lastIdx < html.length) {
    parts.push(
      <div
        key={`h-${key++}`}
        className="cms-html"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html.slice(lastIdx)) }}
      />
    );
  }
  return <Fragment>{parts}</Fragment>;
}