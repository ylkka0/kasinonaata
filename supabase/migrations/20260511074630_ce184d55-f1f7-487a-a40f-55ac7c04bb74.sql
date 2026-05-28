
UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{groups}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN g->>'label' = 'Blogi' AND g ? 'href'
          THEN jsonb_set(g, '{href}', '"/#blogi"'::jsonb)
        ELSE g
      END
    )
    FROM jsonb_array_elements(value->'groups') AS g
  )
)
WHERE key = 'header';
