-- Agrega una dimensión independiente para la línea comercial del producto.
-- Ejecutar manualmente después de 202608060001_add_products.sql.
-- No modifica ni intenta inferir la marca o línea de productos existentes.

alter table public.products
  add column if not exists line_name text null;

comment on column public.products.line_name is
  'Nombre visible de la línea comercial dentro de la marca/categoría del producto.';

create index if not exists products_category_line_display_order_idx
  on public.products (category, line_name, display_order);
