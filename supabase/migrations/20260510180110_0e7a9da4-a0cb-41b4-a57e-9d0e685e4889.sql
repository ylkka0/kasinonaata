ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_blog_posts_display_order ON public.blog_posts(display_order);