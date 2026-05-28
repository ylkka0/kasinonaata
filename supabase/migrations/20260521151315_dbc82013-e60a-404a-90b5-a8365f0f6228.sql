UPDATE site_settings
SET value = jsonb_set(
  value,
  '{groups}',
  (SELECT jsonb_agg(
    CASE WHEN g->>'label'='Uutiset'
      THEN jsonb_set(g, '{items}', '[
        {"href":"/uutiset/uudet-kasinot","label":"Uudet kasinot"},
        {"href":"/uutiset/alan-paivitykset","label":"Alan päivitykset"},
        {"href":"/blogi","label":"Artikkelit"}
      ]'::jsonb)
      ELSE g
    END
  ) FROM jsonb_array_elements(value->'groups') g)
)
WHERE key='header';