CREATE TABLE public.authors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  role text DEFAULT '',
  tagline text DEFAULT '',
  photo_url text,
  content text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 100,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.authors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authors TO authenticated;
GRANT ALL ON public.authors TO service_role;

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published authors"
ON public.authors FOR SELECT
USING (published = true);

CREATE POLICY "Admins manage authors"
ON public.authors FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.authors (slug, name, role, tagline, photo_url, display_order, content) VALUES (
  'jiri-kaartinen',
  'Jiri Kaartinen',
  'iGaming-asiantuntija · Päätoimittaja, Britekasino.com',
  '15 vuotta rahapelialalla – Casino Helsingistä Maltan nettikasinoille.',
  '/src/assets/jiri-kaartinen.png',
  1,
  '<p>Olen Britekasino.comin päätoimittaja ja toiminut 15 vuotta eri tehtävissä kasinoalalla. Olen seissyt pöydän molemmin puolin: ensin pokeridiilerinä ympäri pääkaupunkiseutua, sen jälkeen senior diilerinä Casino Helsingissä viiden vuoden ajan, josta siirryin työskentelemään viidelle eri nettikasinolle Maltalla ja etänä eri maista. Viimeisimpänä toimin Senior Fraud and Payments Analystina Esports Entertainment Groupille (NASDAQ: GMBL).</p><p>Tämä on harvinainen yhdistelmä, jonka takia minulla on uniikki näkemys alan eri puolista.</p><h3>Urani lyhyesti</h3><p>Aloitin vuonna 2009 vetämällä pokeriturnauksia pääkaupunkiseudun baareissa. Vuosina 2012–2017 toimin senior diilerinä Casino Helsingissä.</p><h3>Miten testaan kasinot?</h3><p>Jokainen kasinoarvio perustuu oikeaan pelitiliin, oikeisiin talletuksiin ja oikeisiin kotiutuksiin.</p>'
);