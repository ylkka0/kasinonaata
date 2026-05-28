update public.site_settings
set value = jsonb_build_object(
  'logo_text', 'Kasinonäätä',
  'tagline', 'Suomen rehellisin kasinoasiantuntija',
  'groups', jsonb_build_array(
    jsonb_build_object('label','Etusivu','href','/'),
    jsonb_build_object('label','Uutiset','items', jsonb_build_array(
      jsonb_build_object('label','Uudet kasinot','href','/kasinot'),
      jsonb_build_object('label','Alan päivitykset','href','/blogi'),
      jsonb_build_object('label','Artikkelit','href','/blogi')
    )),
    jsonb_build_object('label','Arvostelut','items', jsonb_build_array(
      jsonb_build_object('label','Pikakasinot','href','/pikakasinot'),
      jsonb_build_object('label','MGA','href','/kasinot'),
      jsonb_build_object('label','Curacao','href','/kasinot'),
      jsonb_build_object('label','EMTA','href','/kasinot')
    )),
    jsonb_build_object('label','Maksutavat','items', jsonb_build_array(
      jsonb_build_object('label','Brite','href','/maksutavat'),
      jsonb_build_object('label','Trustly','href','/maksutavat'),
      jsonb_build_object('label','Zimpler','href','/maksutavat'),
      jsonb_build_object('label','Skrill','href','/maksutavat'),
      jsonb_build_object('label','Neteller','href','/maksutavat')
    )),
    jsonb_build_object('label','Lisenssit','items', jsonb_build_array(
      jsonb_build_object('label','MGA','href','/kasinot'),
      jsonb_build_object('label','EMTA','href','/kasinot'),
      jsonb_build_object('label','Curacao','href','/kasinot')
    )),
    jsonb_build_object('label','Oppaat','href','/blogi'),
    jsonb_build_object('label','Toimitus','items', jsonb_build_array(
      jsonb_build_object('label','Kirjoittajat','href','/blogi'),
      jsonb_build_object('label','Arvostelukäytäntö','href','/blogi')
    ))
  )
)
where key = 'header';
