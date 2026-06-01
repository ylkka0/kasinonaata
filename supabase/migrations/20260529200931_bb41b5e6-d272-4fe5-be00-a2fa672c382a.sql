CREATE TABLE public.casino_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  title text NOT NULL,
  license text NOT NULL DEFAULT '',
  license_flag text NOT NULL DEFAULT '',
  license_tax_note text,
  license_group text NOT NULL DEFAULT 'mga',
  payment_methods text NOT NULL DEFAULT '',
  welcome_bonus text NOT NULL DEFAULT '',
  games text NOT NULL DEFAULT '',
  withdrawals text NOT NULL DEFAULT '',
  support text NOT NULL DEFAULT '',
  logo_url text,
  extras jsonb NOT NULL DEFAULT '[]'::jsonb,
  pros text[] NOT NULL DEFAULT '{}'::text[],
  cons text[] NOT NULL DEFAULT '{}'::text[],
  display_order integer NOT NULL DEFAULT 100,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.casino_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.casino_reviews TO authenticated;
GRANT ALL ON public.casino_reviews TO service_role;

ALTER TABLE public.casino_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published reviews"
  ON public.casino_reviews FOR SELECT
  USING (published = true);

CREATE POLICY "Admins manage reviews"
  ON public.casino_reviews FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_casino_reviews_updated_at
  BEFORE UPDATE ON public.casino_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_casino_reviews_group_order ON public.casino_reviews (license_group, display_order);