CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (char_length(email) BETWEEN 3 AND 200);
CREATE POLICY "Admins view subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));