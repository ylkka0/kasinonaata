import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { pick, type Lang } from "@/lib/i18n";

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  content: string;
  title_en?: string | null;
  meta_title_en?: string | null;
  meta_description_en?: string | null;
  content_en?: string | null;
  updated_at: string;
};

export type HeaderItem = { label: string; href: string; badge?: string };
export type HeaderGroup = { label: string; href?: string; items?: HeaderItem[] };
export type HeaderSettings = {
  logo_text?: string;
  logo_sub?: string;
  tagline?: string;
  groups: HeaderGroup[];
};

export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterSettings = {
  tagline?: string;
  subtitle?: string;
  columns: FooterColumn[];
  responsible_text?: string;
  copyright?: string;
  disclosure?: string;
};

export function usePage(slug: string) {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: async (): Promise<PageRecord | null> => {
      const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
      return (data as PageRecord) ?? null;
    },
    staleTime: 30_000,
  });
}

/** Loader helper: fetch a page row by slug for use in route loaders. */
export async function loadPage(slug: string): Promise<{ page: PageRecord | null }> {
  const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  return { page: (data as PageRecord) ?? null };
}

/** Build head() meta entries from a loaded page. */
export function pageHead(
  loaderData: { page: PageRecord | null } | undefined,
  fallbackTitle: string,
) {
  const p = loaderData?.page;
  const title = p?.meta_title ?? p?.title ?? fallbackTitle;
  const desc = p?.meta_description ?? "";
  return {
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ],
  };
}

/** Resolve language-aware fields from a PageRecord. */
export function localizedPage(p: PageRecord | null | undefined, lang: Lang) {
  if (!p) return p;
  return {
    ...p,
    title: pick(lang, p.title, p.title_en),
    meta_title: pick(lang, p.meta_title, p.meta_title_en),
    meta_description: pick(lang, p.meta_description, p.meta_description_en),
    content: pick(lang, p.content, p.content_en) ?? "",
  };
}

export function useSiteSetting<T>(key: string, fallback: T) {
  const { data } = useQuery({
    queryKey: ["site-setting", key],
    queryFn: async (): Promise<T> => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
      return ((data?.value as T) ?? fallback);
    },
    staleTime: 30_000,
  });
  return data ?? fallback;
}

export const DEFAULT_HEADER: HeaderSettings = {
  logo_text: "Kasinonäätä",
  tagline: "",
  groups: [],
};

export const DEFAULT_FOOTER: FooterSettings = {
  tagline: "",
  subtitle: "",
  columns: [],
  copyright: "",
};