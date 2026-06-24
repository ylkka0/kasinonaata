
ALTER TABLE public.casinos
  ADD COLUMN IF NOT EXISTS bonus_text_en text,
  ADD COLUMN IF NOT EXISTS review_text_en text,
  ADD COLUMN IF NOT EXISTS pros_en text[],
  ADD COLUMN IF NOT EXISTS cons_en text[],
  ADD COLUMN IF NOT EXISTS meta_title_en text,
  ADD COLUMN IF NOT EXISTS meta_description_en text,
  ADD COLUMN IF NOT EXISTS logo_alt_en text;

ALTER TABLE public.authors
  ADD COLUMN IF NOT EXISTS role_en text,
  ADD COLUMN IF NOT EXISTS tagline_en text,
  ADD COLUMN IF NOT EXISTS content_en text;
