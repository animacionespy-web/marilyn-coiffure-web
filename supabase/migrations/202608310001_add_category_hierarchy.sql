-- Jerarquía de categorías y portadas editoriales del catálogo.
-- Ejecutar manualmente después de 202608240002_add_home_media_settings.sql.
-- Esta migración es aditiva: las categorías existentes permanecen como principales
-- y los estilos existentes continúan sin subcategoría.

alter table public.categories
  add column if not exists parent_category_id uuid,
  add column if not exists cover_image_url text,
  add column if not exists cover_image_path text,
  add column if not exists cover_image_zoom numeric not null default 1,
  add column if not exists cover_image_position_x numeric not null default 50,
  add column if not exists cover_image_position_y numeric not null default 50,
  add column if not exists cta_label text,
  add column if not exists cta_href text;

alter table public.categories
  drop constraint if exists categories_parent_category_id_fkey,
  add constraint categories_parent_category_id_fkey
    foreign key (parent_category_id)
    references public.categories(id)
    on delete restrict,
  drop constraint if exists categories_parent_not_self,
  add constraint categories_parent_not_self
    check (parent_category_id is null or parent_category_id <> id),
  drop constraint if exists categories_cover_image_zoom_range,
  add constraint categories_cover_image_zoom_range
    check (cover_image_zoom between 1 and 2.5),
  drop constraint if exists categories_cover_image_position_x_range,
  add constraint categories_cover_image_position_x_range
    check (cover_image_position_x between 0 and 100),
  drop constraint if exists categories_cover_image_position_y_range,
  add constraint categories_cover_image_position_y_range
    check (cover_image_position_y between 0 and 100);

create index if not exists categories_parent_category_id_idx
  on public.categories(parent_category_id);

create or replace function public.validate_category_hierarchy()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  selected_parent_id uuid;
begin
  if new.parent_category_id is null then
    return new;
  end if;

  select parent_category_id
    into selected_parent_id
    from public.categories
   where id = new.parent_category_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'La categoría principal seleccionada no existe.';
  end if;

  if selected_parent_id is not null then
    raise exception using
      errcode = '23514',
      message = 'Solo se permite un nivel de subcategorías.';
  end if;

  if exists (
    select 1
      from public.categories child
     where child.parent_category_id = new.id
       and child.id <> new.id
  ) then
    raise exception using
      errcode = '23514',
      message = 'Una categoría que ya tiene subcategorías no puede convertirse en subcategoría.';
  end if;

  return new;
end;
$$;

drop trigger if exists categories_validate_hierarchy on public.categories;
create trigger categories_validate_hierarchy
before insert or update of parent_category_id on public.categories
for each row execute function public.validate_category_hierarchy();

alter table public.styles
  add column if not exists subcategory_id uuid;

alter table public.styles
  drop constraint if exists styles_subcategory_id_fkey,
  add constraint styles_subcategory_id_fkey
    foreign key (subcategory_id)
    references public.categories(id)
    on delete restrict;

create index if not exists styles_subcategory_id_idx
  on public.styles(subcategory_id);

create or replace function public.validate_style_category_hierarchy()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  selected_parent_id uuid;
begin
  if new.subcategory_id is null then
    return new;
  end if;

  select parent_category_id
    into selected_parent_id
    from public.categories
   where id = new.subcategory_id;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'La subcategoría seleccionada no existe.';
  end if;

  if selected_parent_id is null or selected_parent_id <> new.category_id then
    raise exception using
      errcode = '23514',
      message = 'La subcategoría debe pertenecer a la categoría principal del estilo.';
  end if;

  return new;
end;
$$;

drop trigger if exists styles_validate_category_hierarchy on public.styles;
create trigger styles_validate_category_hierarchy
before insert or update of category_id, subcategory_id on public.styles
for each row execute function public.validate_style_category_hierarchy();

-- Las policies existentes de categories y styles ya limitan escritura a is_admin().
-- Se redefine solamente la lectura pública de styles para respetar también el
-- estado de la categoría principal y de la subcategoría opcional.
drop policy if exists "styles public read active" on public.styles;
create policy "styles public read active" on public.styles
for select to anon, authenticated
using (
  public.is_admin()
  or (
    active
    and exists (
      select 1
        from public.categories main_category
       where main_category.id = category_id
         and main_category.active
         and main_category.parent_category_id is null
    )
    and (
      subcategory_id is null
      or exists (
        select 1
          from public.categories child_category
         where child_category.id = subcategory_id
           and child_category.active
           and child_category.parent_category_id = category_id
      )
    )
  )
);

comment on column public.categories.parent_category_id is
  'Null para categorías principales; apunta a una categoría principal para subcategorías.';
comment on column public.categories.cover_image_url is
  'Imagen pública de portada de la categoría o subcategoría.';
comment on column public.styles.subcategory_id is
  'Subcategoría opcional; debe pertenecer a category_id.';
