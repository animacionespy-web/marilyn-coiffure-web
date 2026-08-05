create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role = 'admin'),
  full_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.styles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text unique not null,
  short_description text,
  full_description text,
  image_url text,
  image_path text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  estimated_duration text,
  price_from numeric check (price_from is null or price_from >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  role text,
  short_description text,
  full_description text,
  image_url text,
  image_path text,
  whatsapp_number text check (whatsapp_number is null or whatsapp_number ~ '^595[0-9]{8,10}$'),
  specialties text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  availability_note text,
  instagram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.style_professionals (
  style_id uuid not null references public.styles(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  primary key (style_id, professional_id)
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists styles_set_updated_at on public.styles;
create trigger styles_set_updated_at before update on public.styles for each row execute function public.set_updated_at();
drop trigger if exists professionals_set_updated_at on public.professionals;
create trigger professionals_set_updated_at before update on public.professionals for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.styles enable row level security;
alter table public.professionals enable row level security;
alter table public.style_professionals enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "profiles select own or admin" on public.profiles;
create policy "profiles select own or admin" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles admin insert" on public.profiles;
create policy "profiles admin insert" on public.profiles for insert to authenticated
with check (public.is_admin());
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles for update to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "profiles admin delete" on public.profiles;
create policy "profiles admin delete" on public.profiles for delete to authenticated
using (public.is_admin());

drop policy if exists "categories public read active" on public.categories;
create policy "categories public read active" on public.categories for select to anon, authenticated
using (active or public.is_admin());
drop policy if exists "categories admin insert" on public.categories;
create policy "categories admin insert" on public.categories for insert to authenticated with check (public.is_admin());
drop policy if exists "categories admin update" on public.categories;
create policy "categories admin update" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "categories admin delete" on public.categories;
create policy "categories admin delete" on public.categories for delete to authenticated using (public.is_admin());

drop policy if exists "styles public read active" on public.styles;
create policy "styles public read active" on public.styles for select to anon, authenticated
using (active or public.is_admin());
drop policy if exists "styles admin insert" on public.styles;
create policy "styles admin insert" on public.styles for insert to authenticated with check (public.is_admin());
drop policy if exists "styles admin update" on public.styles;
create policy "styles admin update" on public.styles for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "styles admin delete" on public.styles;
create policy "styles admin delete" on public.styles for delete to authenticated using (public.is_admin());

drop policy if exists "professionals public read active" on public.professionals;
create policy "professionals public read active" on public.professionals for select to anon, authenticated
using (active or public.is_admin());
drop policy if exists "professionals admin insert" on public.professionals;
create policy "professionals admin insert" on public.professionals for insert to authenticated with check (public.is_admin());
drop policy if exists "professionals admin update" on public.professionals;
create policy "professionals admin update" on public.professionals for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "professionals admin delete" on public.professionals;
create policy "professionals admin delete" on public.professionals for delete to authenticated using (public.is_admin());

drop policy if exists "relations public read active" on public.style_professionals;
create policy "relations public read active" on public.style_professionals for select to anon, authenticated
using (
  public.is_admin() or (
    exists (select 1 from public.styles where id = style_id and active)
    and exists (select 1 from public.professionals where id = professional_id and active)
  )
);
drop policy if exists "relations admin insert" on public.style_professionals;
create policy "relations admin insert" on public.style_professionals for insert to authenticated with check (public.is_admin());
drop policy if exists "relations admin delete" on public.style_professionals;
create policy "relations admin delete" on public.style_professionals for delete to authenticated using (public.is_admin());

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings for select to anon, authenticated
using (key in ('salonName','generalWhatsappNumber','domain','instagramUrl','facebookUrl','heroTitle','heroDescription','heroImageUrl','aboutTitle','aboutText','ctaTitle','ctaDescription','formDisclaimer','address','openingHours','seoTitle','seoDescription','specialties') or public.is_admin());
drop policy if exists "settings admin insert" on public.site_settings;
create policy "settings admin insert" on public.site_settings for insert to authenticated with check (public.is_admin());
drop policy if exists "settings admin update" on public.site_settings;
create policy "settings admin update" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "settings admin delete" on public.site_settings;
create policy "settings admin delete" on public.site_settings for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site images public read" on storage.objects;
create policy "site images public read" on storage.objects for select to public using (bucket_id = 'site-images');
drop policy if exists "site images admin insert" on storage.objects;
create policy "site images admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "site images admin update" on storage.objects;
create policy "site images admin update" on storage.objects for update to authenticated using (bucket_id = 'site-images' and public.is_admin()) with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "site images admin delete" on storage.objects;
create policy "site images admin delete" on storage.objects for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());
