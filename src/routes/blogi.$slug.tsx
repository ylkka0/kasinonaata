import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import DOMPurify from "isomorphic-dompurify";
import { pick, useLang, useT } from "@/lib/i18n";

export const Route = createFileRoute("/blogi/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} – Kasinonäätä` },
      { name: "description", content: "Näädän blogiartikkeli." },
    ],
  }),
  component: BlogPost,
});

// Minimal markdown → HTML (headings, bold, italic, links, images, paragraphs, lists)
function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  const inline = (s: string) =>
    esc(s)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" class="rounded-lg my-4 max-w-full h-auto" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold underline" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^### /.test(line)) { if (inList) { out.push("</ul>"); inList = false; } out.push(`<h3 class="font-display text-2xl text-gold mt-8 mb-3">${inline(line.slice(4))}</h3>`); }
    else if (/^## /.test(line)) { if (inList) { out.push("</ul>"); inList = false; } out.push(`<h2 class="font-display text-3xl text-gold mt-10 mb-4">${inline(line.slice(3))}</h2>`); }
    else if (/^# /.test(line)) { if (inList) { out.push("</ul>"); inList = false; } out.push(`<h1 class="font-display text-4xl mt-10 mb-4">${inline(line.slice(2))}</h1>`); }
    else if (/^[-*] /.test(line)) { if (!inList) { out.push('<ul class="list-disc pl-6 my-4 space-y-1">'); inList = true; } out.push(`<li>${inline(line.slice(2))}</li>`); }
    else if (line === "") { if (inList) { out.push("</ul>"); inList = false; } out.push(""); }
    else { if (inList) { out.push("</ul>"); inList = false; } out.push(`<p class="my-3 leading-relaxed">${inline(line)}</p>`); }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function BlogPost() {
  const { slug } = Route.useParams();
  const { lang } = useLang();
  const t = useT();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading || !post) return <Layout><div className="container mx-auto px-4 py-20">{t("common.loading")}</div></Layout>;

  const title = pick(lang, post.title, (post as any).title_en);
  const excerpt = pick(lang, post.excerpt, (post as any).excerpt_en);
  const content = pick(lang, post.content, (post as any).content_en);
  const coverAlt = pick(lang, post.cover_image_alt, (post as any).cover_image_alt_en);

  return (
    <Layout>
      <article className="container mx-auto px-4 py-10 max-w-3xl">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-gold">{t("common.home")}</Link> / <Link to="/blogi" className="hover:text-gold">{t("blog.crumb")}</Link> / {title}
        </nav>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {post.tags.map((t) => <span key={t} className="text-[11px] uppercase tracking-wider text-gold border border-[color:var(--gold)]/40 rounded-full px-2 py-0.5">{t}</span>)}
          </div>
        )}
        <h1 className="font-display text-5xl leading-tight mb-3">{title}</h1>
        <div className="text-sm text-muted-foreground mb-6">
          {post.author} · {post.published_at && new Date(post.published_at).toLocaleDateString(lang === "en" ? "en-GB" : "fi-FI")}
        </div>
        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={coverAlt ?? title} className="w-full rounded-xl mb-8" />
        )}
        {excerpt && <p className="text-lg text-foreground/85 mb-6 italic">{excerpt}</p>}
        <div
          className="text-foreground/90 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-[color:var(--gold)] [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-[color:var(--gold)] [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:my-3 [&_p]:leading-relaxed [&_a]:text-[color:var(--gold)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_blockquote]:border-l-2 [&_blockquote]:border-[color:var(--gold)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-bold"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              (content ?? "").trim().startsWith("<") ? (content ?? "") : renderMarkdown(content ?? ""),
            ),
          }}
        />
      </article>
    </Layout>
  );
}