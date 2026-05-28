UPDATE site_settings
SET value = jsonb_set(
  value,
  '{groups}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN g->>'label' = 'Toimitus' THEN jsonb_set(
          g,
          '{items}',
          (
            SELECT jsonb_agg(
              CASE WHEN i->>'label' = 'Kirjoittajat'
                THEN jsonb_set(i, '{href}', '"/kirjoittajat"')
                ELSE i END
            )
            FROM jsonb_array_elements(g->'items') i
          )
        )
        ELSE g
      END
    )
    FROM jsonb_array_elements(value->'groups') g
  )
)
WHERE key = 'header';