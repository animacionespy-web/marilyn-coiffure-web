-- Ejecutar manualmente después de 202608050001_initial_schema.sql.
-- No modifica tablas existentes ni ejecuta operaciones destructivas.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text,
  short_description text,
  full_description text,
  image_url text,
  image_path text,
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  price numeric null check (price is null or price >= 0),
  stock_status text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "products public read active" on public.products;
create policy "products public read active"
on public.products for select to anon, authenticated
using (active or public.is_admin());

drop policy if exists "products admin insert" on public.products;
create policy "products admin insert"
on public.products for insert to authenticated
with check (public.is_admin());

drop policy if exists "products admin update" on public.products;
create policy "products admin update"
on public.products for update to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products admin delete" on public.products;
create policy "products admin delete"
on public.products for delete to authenticated
using (public.is_admin());

-- Las imágenes se guardan en site-images/products/. Las políticas existentes
-- del bucket ya permiten lectura pública y escritura exclusiva de administradores.
