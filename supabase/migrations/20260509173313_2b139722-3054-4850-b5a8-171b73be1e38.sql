
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Casinos
CREATE TABLE public.casinos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  logo_alt TEXT,
  bonus_text TEXT,
  rating NUMERIC(3,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 10),
  affiliate_link TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  review_text TEXT,
  pros TEXT[] NOT NULL DEFAULT '{}',
  cons TEXT[] NOT NULL DEFAULT '{}',
  payment_methods TEXT[] NOT NULL DEFAULT '{}',
  game_providers TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  ranking INT NOT NULL DEFAULT 100,
  -- withdrawal speed metrics
  avg_withdrawal_minutes INT,
  fastest_withdrawal_minutes INT,
  fastest_method TEXT,
  speed_updated_at TIMESTAMPTZ,
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.casinos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view casinos" ON public.casinos FOR SELECT USING (true);
CREATE POLICY "Admins manage casinos" ON public.casinos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bonus alerts
CREATE TABLE public.bonus_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  casino_id UUID REFERENCES public.casinos(id) ON DELETE SET NULL,
  affiliate_link TEXT,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bonus_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active alerts" ON public.bonus_alerts FOR SELECT USING (active = true);
CREATE POLICY "Admins manage alerts" ON public.bonus_alerts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Withdrawal reports (community)
CREATE TABLE public.withdrawal_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  casino_id UUID REFERENCES public.casinos(id) ON DELETE SET NULL,
  casino_name TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  withdrawal_minutes INT NOT NULL CHECK (withdrawal_minutes > 0 AND withdrawal_minutes < 100000),
  amount_range TEXT NOT NULL,
  player_location TEXT,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.withdrawal_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views approved reports" ON public.withdrawal_reports FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can submit reports" ON public.withdrawal_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage reports" ON public.withdrawal_reports FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger for casinos
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER casinos_updated_at BEFORE UPDATE ON public.casinos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-assign first user as admin (helper function via trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE WHEN (SELECT count(*) FROM public.user_roles WHERE role = 'admin') = 0
      THEN 'admin'::app_role ELSE 'user'::app_role END
  );
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
