-- Blog posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  cover_image_alt text,
  author text NOT NULL DEFAULT 'Kasinonäätä',
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Admins manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_blog_posts_published ON public.blog_posts (published, published_at DESC);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('casino-logos', 'casino-logos', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
  ON CONFLICT (id) DO NOTHING;

-- Public read on both buckets
CREATE POLICY "Public read casino logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'casino-logos');

CREATE POLICY "Public read blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Admin write on both buckets
CREATE POLICY "Admins upload casino logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'casino-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update casino logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'casino-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete casino logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'casino-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));