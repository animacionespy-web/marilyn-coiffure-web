-- Ubicación pública configurable. Migración aditiva e idempotente.

insert into public.site_settings (key, value)
values
  ('locationMapsUrl', '"https://maps.app.goo.gl/3Ya6hDGUkHnmmjxa9"'::jsonb),
  ('locationEmbedUrl', '"https://www.google.com/maps?q=-25.7816807%2C-56.4475438&z=17&output=embed"'::jsonb),
  ('locationAddress', '"General Díaz, sn, Villarrica 5000"'::jsonb)
on conflict (key) do nothing;

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select to anon, authenticated
  using (key in (
    'salonName', 'generalWhatsappNumber', 'domain', 'instagramUrl', 'facebookUrl',
    'heroTitle', 'heroDescription', 'heroImageUrl', 'heroImageZoom',
    'heroImagePositionX', 'heroImagePositionY', 'aboutTitle', 'aboutText',
    'ctaTitle', 'ctaDescription', 'formDisclaimer', 'address', 'openingHours',
    'seoTitle', 'seoDescription', 'specialties', 'footerImageUrl',
    'footerImageZoom', 'footerImagePositionX', 'footerImagePositionY',
    'locationMapsUrl', 'locationEmbedUrl', 'locationAddress'
  ) or public.is_admin());
