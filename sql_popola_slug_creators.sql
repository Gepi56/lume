update creators
set slug = lower(
  regexp_replace(
    regexp_replace(coalesce(display_name, 'creator') || '-' || substr(id::text, 1, 8), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-|-$)',
    '',
    'g'
  )
)
where (slug is null or btrim(slug) = '');
