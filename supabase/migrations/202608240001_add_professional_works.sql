-- Portfolios públicos administrados únicamente por el admin general.
-- Esta migración es aditiva. Ejecutar manualmente después de 202608120001_add_location_settings.sql.

create table if not exists public.professional_works (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  work_type text not null default 'photo' check (work_type in ('photo', 'before_after')),
  title text,
  image_url text,
  image_path text,
  image_zoom numeric not null default 1 check (image_zoom between 1 and 2.5),
  image_position_x numeric not null default 50 check (image_position_x between 0 and 100),
  image_position_y numeric not null default 50 check (image_position_y between 0 and 100),
  before_image_url text,
  before_image_path text,
  before_image_zoom numeric not null default 1 check (before_image_zoom between 1 and 2.5),
  before_image_position_x numeric not null default 50 check (before_image_position_x between 0 and 100),
  before_image_position_y numeric not null default 50 check (before_image_position_y between 0 and 100),
  after_image_url text,
  after_image_path text,
  after_image_zoom numeric not null default 1 check (after_image_zoom between 1 and 2.5),
  after_image_position_x numeric not null default 50 check (after_image_position_x between 0 and 100),
  after_image_position_y numeric not null default 50 check (after_image_position_y between 0 and 100),
  active boolean not null default true,
  display_order integer not null default 0 check (display_order between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint professional_works_complete_when_active check (
    not active or
    (work_type = 'photo' and nullif(trim(image_url), '') is not null) or
    (work_type = 'before_after'
      and nullif(trim(before_image_url), '') is not null
      and nullif(trim(after_image_url), '') is not null)
  )
);

create index if not exists professional_works_professional_id_idx
  on public.professional_works (professional_id, display_order);

drop trigger if exists professional_works_set_updated_at on public.professional_works;
create trigger professional_works_set_updated_at
  before update on public.professional_works
  for each row execute function public.set_updated_at();

create or replace function public.enforce_professional_works_limit()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (
    select count(*)
    from public.professional_works
    where professional_id = new.professional_id
      and id <> new.id
  ) >= 6 then
    raise exception 'Cada profesional puede tener hasta 6 trabajos.';
  end if;
  return new;
end;
$$;

drop trigger if exists professional_works_limit on public.professional_works;
create trigger professional_works_limit
  before insert or update of professional_id on public.professional_works
  for each row execute function public.enforce_professional_works_limit();

alter table public.professional_works enable row level security;

drop policy if exists "professional works public read active" on public.professional_works;
create policy "professional works public read active"
  on public.professional_works for select to anon, authenticated
  using (
    public.is_admin() or (
      active and exists (
        select 1 from public.professionals
        where professionals.id = professional_id and professionals.active
      )
    )
  );

drop policy if exists "professional works admin insert" on public.professional_works;
create policy "professional works admin insert"
  on public.professional_works for insert to authenticated
  with check (public.is_admin());

drop policy if exists "professional works admin update" on public.professional_works;
create policy "professional works admin update"
  on public.professional_works for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "professional works admin delete" on public.professional_works;
create policy "professional works admin delete"
  on public.professional_works for delete to authenticated
  using (public.is_admin());

comment on table public.professional_works is
  'Portfolio público de profesionales. No crea usuarios, roles ni accesos para profesionales.';
