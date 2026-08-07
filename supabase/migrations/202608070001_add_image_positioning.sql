-- Encuadre visual no destructivo para las imágenes administrables.
-- Ejecutar manualmente después de 202608060001_add_products.sql.

alter table public.styles
  add column if not exists image_zoom numeric not null default 1,
  add column if not exists image_position_x numeric not null default 50,
  add column if not exists image_position_y numeric not null default 50;

alter table public.professionals
  add column if not exists image_zoom numeric not null default 1,
  add column if not exists image_position_x numeric not null default 50,
  add column if not exists image_position_y numeric not null default 50;

alter table public.products
  add column if not exists image_zoom numeric not null default 1,
  add column if not exists image_position_x numeric not null default 50,
  add column if not exists image_position_y numeric not null default 50;

alter table public.styles
  drop constraint if exists styles_image_zoom_range,
  drop constraint if exists styles_image_position_x_range,
  drop constraint if exists styles_image_position_y_range;
alter table public.styles
  add constraint styles_image_zoom_range check (image_zoom between 1 and 2.5),
  add constraint styles_image_position_x_range check (image_position_x between 0 and 100),
  add constraint styles_image_position_y_range check (image_position_y between 0 and 100);

alter table public.professionals
  drop constraint if exists professionals_image_zoom_range,
  drop constraint if exists professionals_image_position_x_range,
  drop constraint if exists professionals_image_position_y_range;
alter table public.professionals
  add constraint professionals_image_zoom_range check (image_zoom between 1 and 2.5),
  add constraint professionals_image_position_x_range check (image_position_x between 0 and 100),
  add constraint professionals_image_position_y_range check (image_position_y between 0 and 100);

alter table public.products
  drop constraint if exists products_image_zoom_range,
  drop constraint if exists products_image_position_x_range,
  drop constraint if exists products_image_position_y_range;
alter table public.products
  add constraint products_image_zoom_range check (image_zoom between 1 and 2.5),
  add constraint products_image_position_x_range check (image_position_x between 0 and 100),
  add constraint products_image_position_y_range check (image_position_y between 0 and 100);

insert into public.site_settings (key, value)
values
  ('heroImageZoom', '1'::jsonb),
  ('heroImagePositionX', '50'::jsonb),
  ('heroImagePositionY', '50'::jsonb),
  ('footerImageUrl', '""'::jsonb),
  ('footerImagePath', '""'::jsonb),
  ('footerImageZoom', '1'::jsonb),
  ('footerImagePositionX', '50'::jsonb),
  ('footerImagePositionY', '50'::jsonb)
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
    'footerImageZoom', 'footerImagePositionX', 'footerImagePositionY'
  ) or public.is_admin());

comment on column public.styles.image_zoom is 'Zoom visual entre 1 y 2.5; no modifica el archivo original.';
comment on column public.professionals.image_zoom is 'Zoom visual entre 1 y 2.5; no modifica el archivo original.';
comment on column public.products.image_zoom is 'Zoom visual entre 1 y 2.5; no modifica el archivo original.';
