
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS excerpt_en text,
  ADD COLUMN IF NOT EXISTS content_en text,
  ADD COLUMN IF NOT EXISTS meta_title_en text,
  ADD COLUMN IF NOT EXISTS meta_description_en text,
  ADD COLUMN IF NOT EXISTS cover_image_alt_en text;

ALTER TABLE public.casino_reviews
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS welcome_bonus_en text,
  ADD COLUMN IF NOT EXISTS games_en text,
  ADD COLUMN IF NOT EXISTS withdrawals_en text,
  ADD COLUMN IF NOT EXISTS support_en text,
  ADD COLUMN IF NOT EXISTS payment_methods_en text,
  ADD COLUMN IF NOT EXISTS pros_en text[],
  ADD COLUMN IF NOT EXISTS cons_en text[],
  ADD COLUMN IF NOT EXISTS extras_en jsonb;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS meta_title_en text,
  ADD COLUMN IF NOT EXISTS meta_description_en text,
  ADD COLUMN IF NOT EXISTS content_en text;

ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS question_en text,
  ADD COLUMN IF NOT EXISTS answer_en text;

ALTER TABLE public.bonus_alerts
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_en text;
