-- Medios independientes para el Antes/Después general y la imagen editorial final de la Home.
-- Migración aditiva e idempotente. No modifica professional_works.

begin;

-- La imagen que anteriormente se guardaba como footerImage* ya correspondía al bloque
-- editorial final. Se copia una sola vez a las nuevas claves explícitas, sin mantener
-- ninguna dependencia posterior entre ambos grupos de settings.
with legacy_final_editorial_settings(new_key, legacy_key) as (
  values
    ('finalEditorialImageUrl', 'footerImageUrl'),
    ('finalEditorialImagePath', 'footerImagePath'),
    ('finalEditorialImageZoom', 'footerImageZoom'),
    ('finalEditorialImagePositionX', 'footerImagePositionX'),
    ('finalEditorialImagePositionY', 'footerImagePositionY')
)
insert into public.site_settings (key, value)
select mapping.new_key, legacy.value
from legacy_final_editorial_settings as mapping
join public.site_settings as legacy on legacy.key = mapping.legacy_key
on conflict (key) do nothing;

-- No existe un Antes/Después global previo confiable. Sus imágenes comienzan vacías;
-- en particular, no se copian imágenes de professional_works ni placeholders locales.
insert into public.site_settings (key, value)
values
  ('homeBeforeAfterTitle', '"Antes y después: cambios que hablan por sí mismos."'::jsonb),
  ('homeBeforeAfterText', '""'::jsonb),
  ('homeBeforeImageUrl', '""'::jsonb),
  ('homeBeforeImagePath', '""'::jsonb),
  ('homeBeforeImageZoom', '1'::jsonb),
  ('homeBeforeImagePositionX', '50'::jsonb),
  ('homeBeforeImagePositionY', '50'::jsonb),
  ('homeAfterImageUrl', '""'::jsonb),
  ('homeAfterImagePath', '""'::jsonb),
  ('homeAfterImageZoom', '1'::jsonb),
  ('homeAfterImagePositionX', '50'::jsonb),
  ('homeAfterImagePositionY', '50'::jsonb),
  ('finalEditorialImageUrl', '""'::jsonb),
  ('finalEditorialImagePath', '""'::jsonb),
  ('finalEditorialImageZoom', '1'::jsonb),
  ('finalEditorialImagePositionX', '50'::jsonb),
  ('finalEditorialImagePositionY', '50'::jsonb)
on conflict (key) do nothing;

-- La lectura pública continúa limitada a una lista explícita. Las rutas internas de
-- Storage no se exponen a visitantes; siguen disponibles para el admin mediante is_admin().
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select to anon, authenticated
  using (
    key in (
      'salonName', 'generalWhatsappNumber', 'domain', 'instagramUrl', 'facebookUrl',
      'heroTitle', 'heroDescription', 'heroImageUrl', 'heroImageZoom',
      'heroImagePositionX', 'heroImagePositionY', 'aboutTitle', 'aboutText',
      'ctaTitle', 'ctaDescription', 'formDisclaimer', 'address', 'openingHours',
      'seoTitle', 'seoDescription', 'specialties', 'footerImageUrl',
      'footerImageZoom', 'footerImagePositionX', 'footerImagePositionY',
      'locationMapsUrl', 'locationEmbedUrl', 'locationAddress',
      'homeBeforeAfterTitle', 'homeBeforeAfterText',
      'homeBeforeImageUrl', 'homeBeforeImageZoom',
      'homeBeforeImagePositionX', 'homeBeforeImagePositionY',
      'homeAfterImageUrl', 'homeAfterImageZoom',
      'homeAfterImagePositionX', 'homeAfterImagePositionY',
      'finalEditorialImageUrl', 'finalEditorialImageZoom',
      'finalEditorialImagePositionX', 'finalEditorialImagePositionY'
    )
    or public.is_admin()
  );

commit;
