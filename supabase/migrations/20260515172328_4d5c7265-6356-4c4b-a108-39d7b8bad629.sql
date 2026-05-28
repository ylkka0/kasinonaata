UPDATE public.site_settings SET value = jsonb_set(value, '{groups}', '[
  {"label":"Etusivu","href":"/"},
  {"label":"Uutiset","items":[
    {"label":"Uudet kasinot","href":"/kasinot"},
    {"label":"Alan päivitykset","href":"/blogi"},
    {"label":"Artikkelit","href":"/blogi"}
  ]},
  {"label":"Arvostelut","items":[
    {"label":"Pikakasinot","href":"/pikakasinot"},
    {"label":"MGA","href":"/kasinot"},
    {"label":"Curacao","href":"/kasinot"},
    {"label":"EMTA","href":"/kasinot"}
  ]},
  {"label":"Maksutavat","items":[
    {"label":"Brite","href":"/maksutavat"},
    {"label":"Trustly","href":"/maksutavat"},
    {"label":"Zimpler","href":"/maksutavat"},
    {"label":"Skrill","href":"/maksutavat"},
    {"label":"Neteller","href":"/maksutavat"}
  ]},
  {"label":"Lisenssit","items":[
    {"label":"MGA","href":"/kasinot"},
    {"label":"EMTA","href":"/kasinot"},
    {"label":"Curacao","href":"/kasinot"}
  ]},
  {"label":"Oppaat","href":"/blogi"},
  {"label":"Toimitus","items":[
    {"label":"Kirjoittajat","href":"/blogi"},
    {"label":"Arvostelukäytäntö","href":"/blogi"}
  ]}
]'::jsonb) WHERE key = 'header';