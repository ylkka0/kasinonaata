-- Pages table for editable content pages
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  meta_title text,
  meta_description text,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pages" ON public.pages FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER pages_set_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Site-wide settings (header, footer, etc.) as key/value JSON
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed pages
INSERT INTO public.pages (slug, title, meta_title, meta_description, content) VALUES
  ('etusivu', 'Etusivu', 'Kasinonäätä – Suomen luotetuimmat nettikasinot', 'Näätä tietää – sinä voitat. Vertaile parhaita nettikasinoita, bonuksia ja kotiutusnopeuksia yhdestä paikasta.', '<p>Tervetuloa Kasinonäädän pariin. Täältä löydät tarkat arviot Suomen parhaista nettikasinoista.</p>'),
  ('bonukset', 'Bonukset', 'Parhaat kasinobonukset 2026 – Kasinonäätä', 'Vertaile parhaita kasinobonuksia: tervetuliaisbonukset, ilmaiskierrokset ja talletusbonukset.', '<h2>Parhaat kasinobonukset</h2><p>Päivitetty lista parhaista bonuksista.</p>[bonus_alerts]<h3>Suosituimmat kasinot bonuksilla</h3>[casinos limit=5]'),
  ('kolikkopelit', 'Kolikkopelit', 'Parhaat kolikkopelit – Kasinonäätä', 'Suomalaisten suosikkikolikkopelit ja parhaat slottikasinot.', '<h2>Suositut kolikkopelit</h2><p>Lista suosituimmista kolikkopeleistä Suomessa.</p>[casinos limit=5]'),
  ('kotiutusnopeus', 'Kotiutusnopeus', 'Nopeimmat kotiutukset – Kasinonäätä', 'Vertaile nettikasinoiden kotiutusnopeuksia ja löydä nopeimmat maksavat kasinot.', '<h2>Nopeat kotiutukset</h2><p>Kasinot järjestyksessä kotiutusnopeuden mukaan.</p>[casinos limit=10]'),
  ('maksutavat', 'Maksutavat', 'Kasinoiden maksutavat – Kasinonäätä', 'Trustly, Pay N Play, korttimaksut ja muut nettikasinoiden maksutavat selitettyinä.', '<h2>Maksutavat nettikasinoilla</h2><p>Yleisimmät maksutavat suomalaisilla nettikasinoilla.</p>'),
  ('pikakasinot', 'Pikakasinot', 'Pikakasinot ilman rekisteröitymistä – Kasinonäätä', 'Pelaa heti, kotiuta nopeasti. Parhaat Pay N Play -pikakasinot.', '<h2>Pikakasinot</h2><p>Pay N Play -kasinot, joissa pelaaminen onnistuu ilman rekisteröitymistä.</p>[casinos limit=5]'),
  ('valitukset', 'Valitukset', 'Tee valitus kasinosta – Kasinonäätä', 'Tee valitus nettikasinosta. Käsittelemme pelaajien ongelmatilanteet luottamuksellisesti.', '<h2>Tee valitus kasinosta</h2><p>Jos sinulla on ongelma nettikasinon kanssa, voit tehdä valituksen täällä.</p>');

-- Seed default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('header', '{
    "logo_text": "Kasinonäätä",
    "nav": [
      {"label": "Kasinot", "href": "/kasinot"},
      {"label": "Bonukset", "href": "/bonukset"},
      {"label": "Kolikkopelit", "href": "/kolikkopelit"},
      {"label": "Kotiutusnopeus", "href": "/kotiutusnopeus"},
      {"label": "Maksutavat", "href": "/maksutavat"},
      {"label": "Pikakasinot", "href": "/pikakasinot"},
      {"label": "Blogi", "href": "/blogi"},
      {"label": "Valitukset", "href": "/valitukset"}
    ]
  }'::jsonb),
  ('footer', '{
    "tagline": "Näätä tietää – sinä voitat.",
    "columns": [
      {"title": "Sivusto", "links": [
        {"label": "Etusivu", "href": "/"},
        {"label": "Kasinot", "href": "/kasinot"},
        {"label": "Blogi", "href": "/blogi"}
      ]},
      {"title": "Apua", "links": [
        {"label": "Valitukset", "href": "/valitukset"},
        {"label": "Maksutavat", "href": "/maksutavat"}
      ]}
    ],
    "copyright": "© 2026 Kasinonäätä. Kaikki oikeudet pidätetään. Pelaa vastuullisesti — 18+.",
    "responsible_gaming": "Pelaaminen on aikuisten viihdettä. Aseta itsellesi rajat. Apua peliongelmiin: peluuri.fi"
  }'::jsonb);
