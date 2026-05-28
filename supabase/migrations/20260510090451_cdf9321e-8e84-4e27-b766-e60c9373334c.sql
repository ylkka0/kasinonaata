
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TYPE public.complaint_status AS ENUM ('pending', 'in_progress', 'resolved', 'rejected', 'unresolved');
CREATE TYPE public.complaint_issue AS ENUM ('no_payment', 'account_closed', 'bonus_issue', 'technical', 'other');

CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  display_name text NOT NULL,
  email text NOT NULL,
  casino_name text NOT NULL,
  issue_type public.complaint_issue NOT NULL,
  description text NOT NULL,
  amount_eur numeric(12,2),
  status public.complaint_status NOT NULL DEFAULT 'pending',
  resolution_notes text,
  is_public boolean NOT NULL DEFAULT true,
  CONSTRAINT complaints_display_name_len CHECK (char_length(display_name) BETWEEN 1 AND 80),
  CONSTRAINT complaints_email_len CHECK (char_length(email) BETWEEN 3 AND 200),
  CONSTRAINT complaints_casino_len CHECK (char_length(casino_name) BETWEEN 1 AND 120),
  CONSTRAINT complaints_desc_len CHECK (char_length(description) BETWEEN 50 AND 5000)
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a complaint"
  ON public.complaints FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND is_public = true);

CREATE POLICY "Anyone views public non-pending complaints"
  ON public.complaints FOR SELECT TO anon, authenticated
  USING (is_public = true AND status <> 'pending');

CREATE POLICY "Admins manage complaints"
  ON public.complaints FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
