import { siteConfig } from '../config/site'
import { professionals as fallbackProfessionals } from '../data/professionals'
import { products as fallbackProducts } from '../data/products'
import { siteContent } from '../data/siteContent'
import { styles as fallbackStyles } from '../data/styles'
import { requireSupabase, supabaseConfiguration } from '../lib/supabase'
import type { Professional, ProfessionalSpecialty, ProfessionalWork } from '../types/professional'
import type { Product, ProductCategory } from '../types/product'
import type { Style, StyleCategory } from '../types/style'
import type {
  AdminProfessional,
  AdminProfessionalWork,
  AdminProduct,
  AdminStyle,
  Category,
  DashboardSummary,
  SiteSettings,
} from '../types/admin'
import type {
  DatabaseCategoryRow,
  DatabaseProfessionalRow,
  DatabaseProfessionalWorkRow,
  DatabaseProductRow,
  DatabaseSettingRow,
  DatabaseStyleRow,
} from '../types/database'
import { humanizeDataError, logDataError } from '../utils/admin'
import { normalizeImagePosition } from '../types/image'

interface StyleProfessionalRow {
  style_id: string
  professional_id: string
}

export const fallbackSiteSettings: SiteSettings = {
  salonName: siteConfig.name,
  generalWhatsappNumber: siteConfig.generalWhatsappNumber,
  domain: siteConfig.domain,
  instagramUrl: '',
  facebookUrl: '',
  heroTitle: siteContent.hero.title,
  heroDescription: siteContent.hero.description,
  heroImageUrl: '/images/home/marilyn-portada.jpeg',
  heroImagePath: '',
  heroImageZoom: 1,
  heroImagePositionX: 50,
  heroImagePositionY: 34,
  homeBeforeAfterTitle: 'Antes y después: cambios que hablan por sí mismos.',
  homeBeforeAfterText: '',
  homeBeforeImageUrl: '',
  homeBeforeImagePath: '',
  homeBeforeImageZoom: 1,
  homeBeforeImagePositionX: 50,
  homeBeforeImagePositionY: 50,
  homeAfterImageUrl: '',
  homeAfterImagePath: '',
  homeAfterImageZoom: 1,
  homeAfterImagePositionX: 50,
  homeAfterImagePositionY: 50,
  finalEditorialImageUrl: '',
  finalEditorialImagePath: '',
  finalEditorialImageZoom: 1,
  finalEditorialImagePositionX: 50,
  finalEditorialImagePositionY: 50,
  aboutTitle: siteContent.about.title,
  aboutText: siteContent.about.paragraphs.join('\n\n'),
  ctaTitle: siteContent.contact.title,
  ctaDescription: siteContent.contact.description,
  formDisclaimer: siteConfig.consultation.disclaimer,
  locationMapsUrl: 'https://maps.app.goo.gl/3Ya6hDGUkHnmmjxa9',
  locationEmbedUrl: 'https://www.google.com/maps?q=-25.7816807%2C-56.4475438&z=17&output=embed',
  locationAddress: 'General Díaz, sn, Villarrica 5000',
  address: '',
  openingHours: '',
  seoTitle: 'Marilyn Coiffure | Belleza y estilo',
  seoDescription: 'Coloración, peinados y cuidado capilar con atención personalizada en Marilyn Coiffure.',
  specialties: siteContent.specialties.map(({ title, description }) => ({ title, description })),
  homeVisualBlocks: [
    { id: 'color', eyebrow: 'Color', title: 'Color & Transformaciones', text: 'Tonos, luces y cambios creados a partir de un diagnóstico profesional.', imageUrl: '/images/styles/color-miel.svg', imagePath: '', imagePosition: { zoom: 1, positionX: 50, positionY: 50 }, href: '/estilos?categoria=Coloración' },
    { id: 'cuts', eyebrow: 'Forma', title: 'Cortes & Styling', text: 'Cortes con intención y terminaciones pensadas para acompañar tu rutina.', imageUrl: '/images/styles/corte-bob.svg', imagePath: '', imagePosition: { zoom: 1, positionX: 50, positionY: 50 }, href: '/estilos?categoria=Cortes' },
    { id: 'treatments', eyebrow: 'Cuidado', title: 'Tratamientos & Salud capilar', text: 'Experiencias de hidratación y reparación definidas según tu cabello.', imageUrl: '/images/styles/tratamiento-hidratacion.svg', imagePath: '', imagePosition: { zoom: 1, positionX: 50, positionY: 50 }, href: '/estilos?categoria=Tratamientos' },
    { id: 'events', eyebrow: 'Ocasiones', title: 'Novias & Eventos', text: 'Peinados y preparación personalizada para momentos que merecen atención especial.', imageUrl: '/images/styles/quince-semirrecogido.svg', imagePath: '', imagePosition: { zoom: 1, positionX: 50, positionY: 50 }, href: '/estilos?categoria=Quinceañeras' },
  ],
}

const sortByOrderAndName = <Item extends { displayOrder: number; name: string }>(items: Item[]) =>
  items.sort((first, second) => first.displayOrder - second.displayOrder || first.name.localeCompare(second.name, 'es'))

function mapCategory(row: DatabaseCategoryRow): Category {
  return {
    id: row.id,
    parentCategoryId: row.parent_category_id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    icon: row.icon ?? '',
    coverImageUrl: row.cover_image_url ?? '',
    coverImagePath: row.cover_image_path ?? '',
    coverImagePosition: normalizeImagePosition({
      zoom: row.cover_image_zoom ?? 1,
      positionX: row.cover_image_position_x ?? 50,
      positionY: row.cover_image_position_y ?? 50,
    }),
    ctaLabel: row.cta_label ?? '',
    ctaHref: row.cta_href ?? '',
    active: row.active,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapAdminStyle(row: DatabaseStyleRow, professionalIds: string[]): AdminStyle {
  return {
    id: row.id,
    categoryId: row.category_id,
    subcategoryId: row.subcategory_id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description ?? '',
    fullDescription: row.full_description ?? '',
    imageUrl: row.image_url ?? '',
    imagePath: row.image_path ?? '',
    imagePosition: normalizeImagePosition({
      zoom: row.image_zoom ?? 1,
      positionX: row.image_position_x ?? 50,
      positionY: row.image_position_y ?? 50,
    }),
    tags: row.tags ?? [],
    featured: row.featured,
    active: row.active,
    displayOrder: row.display_order,
    estimatedDuration: row.estimated_duration ?? '',
    priceFrom: row.price_from,
    professionalIds,
  }
}

function mapAdminProfessionalWork(row: DatabaseProfessionalWorkRow): AdminProfessionalWork {
  return {
    id: row.id,
    professionalId: row.professional_id,
    type: row.work_type,
    title: row.title ?? '',
    imageUrl: row.image_url ?? '',
    imagePath: row.image_path ?? '',
    imagePosition: normalizeImagePosition({ zoom: row.image_zoom ?? 1, positionX: row.image_position_x ?? 50, positionY: row.image_position_y ?? 50 }),
    beforeImageUrl: row.before_image_url ?? '',
    beforeImagePath: row.before_image_path ?? '',
    beforeImagePosition: normalizeImagePosition({ zoom: row.before_image_zoom ?? 1, positionX: row.before_image_position_x ?? 50, positionY: row.before_image_position_y ?? 50 }),
    afterImageUrl: row.after_image_url ?? '',
    afterImagePath: row.after_image_path ?? '',
    afterImagePosition: normalizeImagePosition({ zoom: row.after_image_zoom ?? 1, positionX: row.after_image_position_x ?? 50, positionY: row.after_image_position_y ?? 50 }),
    active: row.active,
    displayOrder: row.display_order,
  }
}

function mapAdminProfessional(row: DatabaseProfessionalRow, styleIds: string[], works: AdminProfessionalWork[]): AdminProfessional {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    role: row.role ?? '',
    shortDescription: row.short_description ?? '',
    fullDescription: row.full_description ?? '',
    imageUrl: row.image_url ?? '',
    imagePath: row.image_path ?? '',
    imagePosition: normalizeImagePosition({
      zoom: row.image_zoom ?? 1,
      positionX: row.image_position_x ?? 50,
      positionY: row.image_position_y ?? 50,
    }),
    whatsappNumber: row.whatsapp_number ?? '',
    specialties: row.specialties ?? [],
    featured: row.featured,
    active: row.active,
    displayOrder: row.display_order,
    availabilityNote: row.availability_note ?? '',
    instagramUrl: row.instagram_url ?? '',
    styleIds,
    works,
  }
}

function mapAdminProduct(row: DatabaseProductRow): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category ?? '',
    shortDescription: row.short_description ?? '',
    fullDescription: row.full_description ?? '',
    imageUrl: row.image_url ?? '',
    imagePath: row.image_path ?? '',
    imagePosition: normalizeImagePosition({
      zoom: row.image_zoom ?? 1,
      positionX: row.image_position_x ?? 50,
      positionY: row.image_position_y ?? 50,
    }),
    featured: row.featured,
    active: row.active,
    displayOrder: row.display_order,
    price: row.price,
    stockStatus: row.stock_status ?? '',
  }
}

async function getRelations() {
  const client = requireSupabase()
  const { data, error } = await client.from('style_professionals').select('style_id, professional_id')
  if (error) throw error
  return (data ?? []) as StyleProfessionalRow[]
}

export const categoriesService = {
  async list(includeInactive = true) {
    const client = requireSupabase()
    let query = client.from('categories').select('*').order('display_order').order('name')
    if (!includeInactive) query = query.eq('active', true)
    const { data, error } = await query
    if (error) throw new Error(humanizeDataError(error, 'No pudimos cargar las categorías.'))
    return sortByOrderAndName(((data ?? []) as DatabaseCategoryRow[]).map(mapCategory))
  },
  async save(category: Omit<Category, 'createdAt' | 'updatedAt'>) {
    const client = requireSupabase()
    const payload = {
      id: category.id || undefined,
      parent_category_id: category.parentCategoryId,
      name: category.name.trim(),
      slug: category.slug.trim(),
      description: category.description.trim() || null,
      icon: category.icon.trim() || null,
      cover_image_url: category.coverImageUrl || null,
      cover_image_path: category.coverImagePath || null,
      cover_image_zoom: category.coverImagePosition.zoom,
      cover_image_position_x: category.coverImagePosition.positionX,
      cover_image_position_y: category.coverImagePosition.positionY,
      cta_label: category.ctaLabel.trim() || null,
      cta_href: category.ctaHref.trim() || null,
      active: category.active,
      display_order: category.displayOrder,
    }
    const { data, error } = await client.from('categories').upsert(payload).select('*').single()
    if (error) throw new Error(humanizeDataError(error, 'No se pudo guardar la categoría.'))
    return mapCategory(data as DatabaseCategoryRow)
  },
  async remove(categoryId: string) {
    const client = requireSupabase()
    const { count: childCount, error: childError } = await client
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('parent_category_id', categoryId)
    if (childError) throw new Error('No se pudieron verificar las subcategorías relacionadas.')
    if ((childCount ?? 0) > 0) throw new Error('Esta categoría tiene subcategorías. Eliminá o reasigná primero esas subcategorías.')
    const { count, error: countError } = await client
      .from('styles')
      .select('id', { count: 'exact', head: true })
      .or(`category_id.eq.${categoryId},subcategory_id.eq.${categoryId}`)
    if (countError) throw new Error('No se pudo verificar el contenido relacionado.')
    if ((count ?? 0) > 0) throw new Error('Esta categoría tiene estilos asociados. Desactivala o reasigná esos estilos antes de eliminarla.')
    const { error } = await client.from('categories').delete().eq('id', categoryId)
    if (error) throw new Error(humanizeDataError(error, 'No se pudo eliminar la categoría.'))
  },
}

export const stylesService = {
  async list(includeInactive = true) {
    const client = requireSupabase()
    let query = client.from('styles').select('*').order('display_order').order('name')
    if (!includeInactive) query = query.eq('active', true)
    const [{ data, error }, relations] = await Promise.all([query, getRelations()])
    if (error) throw new Error(humanizeDataError(error, 'No pudimos cargar los estilos.'))
    return ((data ?? []) as DatabaseStyleRow[]).map((row) => mapAdminStyle(
      row,
      relations.filter((relation) => relation.style_id === row.id).map((relation) => relation.professional_id),
    ))
  },
  async save(style: AdminStyle) {
    if (style.priceFrom !== null && style.priceFrom < 0) throw new Error('El precio no puede ser negativo.')
    const client = requireSupabase()
    const payload = {
      id: style.id || undefined,
      category_id: style.categoryId,
      subcategory_id: style.subcategoryId,
      name: style.name.trim(),
      slug: style.slug.trim(),
      short_description: style.shortDescription.trim() || null,
      full_description: style.fullDescription.trim() || null,
      image_url: style.imageUrl || null,
      image_path: style.imagePath || null,
      image_zoom: style.imagePosition.zoom,
      image_position_x: style.imagePosition.positionX,
      image_position_y: style.imagePosition.positionY,
      tags: style.tags,
      featured: style.featured,
      active: style.active,
      display_order: style.displayOrder,
      estimated_duration: style.estimatedDuration.trim() || null,
      price_from: style.priceFrom,
    }
    let duplicateQuery = client.from('styles').select('id').eq('slug', payload.slug)
    if (style.id) duplicateQuery = duplicateQuery.neq('id', style.id)
    const { data: duplicate, error: duplicateError } = await duplicateQuery.maybeSingle()
    if (duplicateError) {
      logDataError('No se pudo validar el slug del estilo', duplicateError)
      throw new Error(humanizeDataError(duplicateError, 'No se pudo validar el slug del estilo.'))
    }
    if (duplicate) throw new Error('Ya existe un contenido con ese slug.')

    const mutation = style.id
      ? client.from('styles').update(payload).eq('id', style.id)
      : client.from('styles').insert(payload)
    const { data, error } = await mutation.select('*').single()
    if (error) {
      logDataError(style.id ? 'Falló la actualización de styles' : 'Falló la creación de styles', error)
      throw new Error(humanizeDataError(error, 'No se pudo guardar el estilo.'))
    }
    const saved = data as DatabaseStyleRow
    const { data: currentRelations, error: relationsReadError } = await client
      .from('style_professionals')
      .select('professional_id')
      .eq('style_id', saved.id)
    if (relationsReadError) {
      logDataError('El estilo se guardó, pero falló la lectura de style_professionals', relationsReadError)
      throw new Error('El estilo se guardó, pero no se pudieron verificar sus profesionales.')
    }
    const currentIds = new Set((currentRelations ?? []).map((relation) => relation.professional_id as string))
    const requestedIds = new Set(style.professionalIds)
    const removedIds = [...currentIds].filter((professionalId) => !requestedIds.has(professionalId))
    const addedIds = [...requestedIds].filter((professionalId) => !currentIds.has(professionalId))
    if (removedIds.length) {
      const { error: deleteError } = await client
        .from('style_professionals')
        .delete()
        .eq('style_id', saved.id)
        .in('professional_id', removedIds)
      if (deleteError) {
        logDataError('El estilo se guardó, pero falló la eliminación en style_professionals', deleteError)
        throw new Error('El estilo se guardó, pero no se pudieron actualizar sus profesionales.')
      }
    }
    if (addedIds.length) {
      const { error: relationError } = await client.from('style_professionals').insert(
        addedIds.map((professionalId) => ({ style_id: saved.id, professional_id: professionalId })),
      )
      if (relationError) {
        logDataError('El estilo se guardó, pero falló la inserción en style_professionals', relationError)
        throw new Error('El estilo se guardó, pero no se pudieron actualizar sus profesionales.')
      }
    }
    return mapAdminStyle(saved, style.professionalIds)
  },
  async remove(style: AdminStyle) {
    const client = requireSupabase()
    const { error } = await client.from('styles').delete().eq('id', style.id)
    if (error) throw new Error(humanizeDataError(error, 'No se pudo eliminar el estilo.'))
  },
}

export const professionalsService = {
  async list(includeInactive = true) {
    const client = requireSupabase()
    let query = client.from('professionals').select('*').order('display_order').order('name')
    if (!includeInactive) query = query.eq('active', true)
    const [{ data, error }, relations, works] = await Promise.all([query, getRelations(), getProfessionalWorks(includeInactive)])
    if (error) throw new Error(humanizeDataError(error, 'No pudimos cargar las profesionales.'))
    return ((data ?? []) as DatabaseProfessionalRow[]).map((row) => mapAdminProfessional(
      row,
      relations.filter((relation) => relation.professional_id === row.id).map((relation) => relation.style_id),
      works.filter((work) => work.professionalId === row.id),
    ))
  },
  async save(professional: AdminProfessional) {
    const client = requireSupabase()
    const payload = {
      id: professional.id || undefined,
      name: professional.name.trim(),
      slug: professional.slug.trim(),
      role: professional.role.trim() || null,
      short_description: professional.shortDescription.trim() || null,
      full_description: professional.fullDescription.trim() || null,
      image_url: professional.imageUrl || null,
      image_path: professional.imagePath || null,
      image_zoom: professional.imagePosition.zoom,
      image_position_x: professional.imagePosition.positionX,
      image_position_y: professional.imagePosition.positionY,
      whatsapp_number: professional.whatsappNumber.replace(/\D/g, '') || null,
      specialties: professional.specialties,
      featured: professional.featured,
      active: professional.active,
      display_order: professional.displayOrder,
      availability_note: professional.availabilityNote.trim() || null,
      instagram_url: professional.instagramUrl.trim() || null,
    }
    const { data, error } = await client.from('professionals').upsert(payload).select('*').single()
    if (error) throw new Error(humanizeDataError(error, 'No se pudo guardar la profesional.'))
    const saved = data as DatabaseProfessionalRow
    const { error: deleteError } = await client.from('style_professionals').delete().eq('professional_id', saved.id)
    if (deleteError) throw new Error('La profesional se guardó, pero no se pudieron actualizar sus estilos.')
    if (professional.styleIds.length) {
      const { error: relationError } = await client.from('style_professionals').insert(
        professional.styleIds.map((styleId) => ({ style_id: styleId, professional_id: saved.id })),
      )
      if (relationError) throw new Error('La profesional se guardó, pero no se pudieron actualizar sus estilos.')
    }
    const works = await syncProfessionalWorks(saved.id, professional.works)
    return mapAdminProfessional(saved, professional.styleIds, works)
  },
  async remove(professional: AdminProfessional) {
    const client = requireSupabase()
    const { error } = await client.from('professionals').delete().eq('id', professional.id)
    if (error) throw new Error(humanizeDataError(error, 'No se pudo eliminar la profesional.'))
  },
}

export const productsService = {
  async list(includeInactive = true) {
    const client = requireSupabase()
    let query = client.from('products').select('*').order('display_order').order('name')
    if (!includeInactive) query = query.eq('active', true)
    const { data, error } = await query
    if (error) throw new Error(humanizeDataError(error, 'No pudimos cargar los productos.'))
    return sortByOrderAndName(((data ?? []) as DatabaseProductRow[]).map(mapAdminProduct))
  },
  async save(product: AdminProduct) {
    if (!Number.isInteger(product.displayOrder) || product.displayOrder < 0) throw new Error('El orden debe ser un número entero válido.')
    if (product.price !== null && product.price < 0) throw new Error('El precio no puede ser negativo.')
    const client = requireSupabase()
    const payload = {
      id: product.id || undefined,
      name: product.name.trim(),
      slug: product.slug.trim(),
      category: product.category.trim() || null,
      short_description: product.shortDescription.trim() || null,
      full_description: product.fullDescription.trim() || null,
      image_url: product.imageUrl || null,
      image_path: product.imagePath || null,
      image_zoom: product.imagePosition.zoom,
      image_position_x: product.imagePosition.positionX,
      image_position_y: product.imagePosition.positionY,
      featured: product.featured,
      active: product.active,
      display_order: product.displayOrder,
      price: product.price,
      stock_status: product.stockStatus.trim() || null,
    }
    const { data, error } = await client.from('products').upsert(payload).select('*').single()
    if (error) throw new Error(humanizeDataError(error, 'No se pudo guardar el producto.'))
    return mapAdminProduct(data as DatabaseProductRow)
  },
  async remove(product: AdminProduct) {
    const client = requireSupabase()
    const { error } = await client.from('products').delete().eq('id', product.id)
    if (error) throw new Error(humanizeDataError(error, 'No se pudo eliminar el producto.'))
  },
}

async function getProfessionalWorks(includeInactive = true) {
  const client = requireSupabase()
  let query = client.from('professional_works').select('*').order('display_order')
  if (!includeInactive) query = query.eq('active', true)
  const { data, error } = await query
  if (error?.code === '42P01') return []
  if (error) throw error
  return ((data ?? []) as DatabaseProfessionalWorkRow[]).map(mapAdminProfessionalWork)
}

async function syncProfessionalWorks(professionalId: string, works: AdminProfessionalWork[]) {
  if (works.length > 6) throw new Error('Cada profesional puede tener hasta 6 trabajos.')
  const client = requireSupabase()
  const normalizedWorks = works.map((work, index) => ({ ...work, professionalId, displayOrder: index }))
  const { data: existingRows, error: existingError } = await client.from('professional_works').select('id').eq('professional_id', professionalId)
  if (existingError) throw new Error('La profesional se guardó, pero no se pudieron verificar sus trabajos actuales.')
  if (!normalizedWorks.length) {
    const { error: deleteError } = await client.from('professional_works').delete().eq('professional_id', professionalId)
    if (deleteError) throw new Error('La profesional se guardó, pero no se pudieron quitar sus trabajos.')
    return []
  }

  const payload = normalizedWorks.map((work) => ({
    id: work.id,
    professional_id: professionalId,
    work_type: work.type,
    title: work.title.trim() || null,
    image_url: work.type === 'photo' ? work.imageUrl || null : null,
    image_path: work.type === 'photo' ? work.imagePath || null : null,
    image_zoom: work.imagePosition.zoom,
    image_position_x: work.imagePosition.positionX,
    image_position_y: work.imagePosition.positionY,
    before_image_url: work.type === 'before_after' ? work.beforeImageUrl || null : null,
    before_image_path: work.type === 'before_after' ? work.beforeImagePath || null : null,
    before_image_zoom: work.beforeImagePosition.zoom,
    before_image_position_x: work.beforeImagePosition.positionX,
    before_image_position_y: work.beforeImagePosition.positionY,
    after_image_url: work.type === 'before_after' ? work.afterImageUrl || null : null,
    after_image_path: work.type === 'before_after' ? work.afterImagePath || null : null,
    after_image_zoom: work.afterImagePosition.zoom,
    after_image_position_x: work.afterImagePosition.positionX,
    after_image_position_y: work.afterImagePosition.positionY,
    active: work.active,
    display_order: work.displayOrder,
  }))
  const { data, error } = await client.from('professional_works').upsert(payload).select('*')
  if (error) throw new Error(humanizeDataError(error, 'La profesional se guardó, pero no se pudieron actualizar sus trabajos.'))
  const retainedIds = new Set(normalizedWorks.map((work) => work.id))
  const staleIds = ((existingRows ?? []) as Array<{ id: string }>).map((row) => row.id).filter((id) => !retainedIds.has(id))
  if (staleIds.length) {
    const { error: deleteError } = await client.from('professional_works').delete().in('id', staleIds)
    if (deleteError) throw new Error('Los trabajos se guardaron, pero no se pudieron quitar los trabajos eliminados.')
  }
  return ((data ?? []) as DatabaseProfessionalWorkRow[]).map(mapAdminProfessionalWork).sort((first, second) => first.displayOrder - second.displayOrder)
}

export const settingsService = {
  async get() {
    const client = requireSupabase()
    const { data, error } = await client.from('site_settings').select('*')
    if (error) throw new Error(humanizeDataError(error, 'No pudimos cargar la configuración.'))
    const settings = { ...fallbackSiteSettings }
    for (const row of (data ?? []) as DatabaseSettingRow[]) {
      if (row.key in settings) Object.assign(settings, { [row.key]: row.value })
    }
    if (!settings.heroImageUrl.trim()) settings.heroImageUrl = fallbackSiteSettings.heroImageUrl
    const heroPosition = normalizeImagePosition({ zoom: settings.heroImageZoom, positionX: settings.heroImagePositionX, positionY: settings.heroImagePositionY })
    settings.heroImageZoom = heroPosition.zoom
    settings.heroImagePositionX = heroPosition.positionX
    settings.heroImagePositionY = heroPosition.positionY
    const beforePosition = normalizeImagePosition({ zoom: settings.homeBeforeImageZoom, positionX: settings.homeBeforeImagePositionX, positionY: settings.homeBeforeImagePositionY })
    settings.homeBeforeImageZoom = beforePosition.zoom
    settings.homeBeforeImagePositionX = beforePosition.positionX
    settings.homeBeforeImagePositionY = beforePosition.positionY
    const afterPosition = normalizeImagePosition({ zoom: settings.homeAfterImageZoom, positionX: settings.homeAfterImagePositionX, positionY: settings.homeAfterImagePositionY })
    settings.homeAfterImageZoom = afterPosition.zoom
    settings.homeAfterImagePositionX = afterPosition.positionX
    settings.homeAfterImagePositionY = afterPosition.positionY
    const finalEditorialPosition = normalizeImagePosition({ zoom: settings.finalEditorialImageZoom, positionX: settings.finalEditorialImagePositionX, positionY: settings.finalEditorialImagePositionY })
    settings.finalEditorialImageZoom = finalEditorialPosition.zoom
    settings.finalEditorialImagePositionX = finalEditorialPosition.positionX
    settings.finalEditorialImagePositionY = finalEditorialPosition.positionY
    const configuredBlocks = Array.isArray(settings.homeVisualBlocks) ? settings.homeVisualBlocks : []
    settings.homeVisualBlocks = fallbackSiteSettings.homeVisualBlocks.map((fallbackBlock) => {
      const configured = configuredBlocks.find((block) => block && block.id === fallbackBlock.id)
      return configured ? {
        ...fallbackBlock,
        ...configured,
        imagePosition: normalizeImagePosition(configured.imagePosition),
      } : { ...fallbackBlock, imagePosition: { ...fallbackBlock.imagePosition } }
    })
    return settings
  },
  async save(values: Partial<SiteSettings>) {
    const client = requireSupabase()
    const rows = Object.entries(values).map(([key, value]) => ({ key, value }))
    const { error } = await client.from('site_settings').upsert(rows, { onConflict: 'key' })
    if (error) throw new Error(humanizeDataError(error, 'No se pudo guardar la configuración.'))
  },
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const [styles, professionals, categories] = await Promise.all([
      stylesService.list(),
      professionalsService.list(),
      categoriesService.list(),
    ])
    return {
      totalStyles: styles.length,
      activeStyles: styles.filter((item) => item.active).length,
      featuredStyles: styles.filter((item) => item.featured).length,
      totalProfessionals: professionals.length,
      activeProfessionals: professionals.filter((item) => item.active).length,
      totalCategories: categories.length,
    }
  },
}

export interface PublicContent {
  styles: Style[]
  professionals: Professional[]
  products: Product[]
  categories: Category[]
  settings: SiteSettings
  source: 'supabase' | 'fallback'
}

function toPublicStyle(style: AdminStyle, categories: Category[]): Style | null {
  const category = categories.find((item) => item.id === style.categoryId && !item.parentCategoryId)
  if (!category) return null
  const subcategory = style.subcategoryId
    ? categories.find((item) => item.id === style.subcategoryId && item.parentCategoryId === category.id)
    : undefined
  return {
    id: style.id,
    slug: style.slug,
    name: style.name,
    category: category.name as StyleCategory,
    subcategory: subcategory?.name,
    shortDescription: style.shortDescription,
    fullDescription: style.fullDescription,
    image: style.imageUrl || '/images/styles/corte-bob.svg',
    imageAlt: `Referencia visual para ${style.name}`,
    imagePosition: style.imagePosition,
    tags: style.tags,
    featured: style.featured,
    order: style.displayOrder,
    active: style.active,
    estimatedDuration: style.estimatedDuration || undefined,
    priceFrom: style.priceFrom === null ? undefined : String(style.priceFrom),
    professionalIds: style.professionalIds,
  }
}

function toPublicProfessional(professional: AdminProfessional): Professional {
  return {
    id: professional.id,
    slug: professional.slug,
    name: professional.name,
    role: professional.role,
    specialties: professional.specialties as ProfessionalSpecialty[],
    shortDescription: professional.shortDescription,
    fullDescription: professional.fullDescription,
    image: professional.imageUrl || '/images/professionals/marilyn.svg',
    imageAlt: `Fotografía de ${professional.name}`,
    imagePosition: professional.imagePosition,
    whatsappNumber: professional.whatsappNumber,
    active: professional.active,
    featured: professional.featured,
    order: professional.displayOrder,
    styleIds: professional.styleIds,
    availabilityNote: professional.availabilityNote,
    instagramUrl: professional.instagramUrl,
    works: professional.works
      .filter((work) => {
        if (!work.active) return false
        if (work.type === 'photo') return Boolean(work.imageUrl.trim())
        const beforeImage = work.beforeImageUrl.trim()
        const afterImage = work.afterImageUrl.trim()
        return Boolean(beforeImage && afterImage && beforeImage !== afterImage)
      })
      .sort((first, second) => first.displayOrder - second.displayOrder)
      .map((work): ProfessionalWork => ({
        id: work.id,
        professionalId: professional.id,
        type: work.type,
        title: work.title,
        image: work.imageUrl,
        imageAlt: work.title ? `${work.title}, trabajo de ${professional.name}` : `Trabajo realizado por ${professional.name}`,
        imagePosition: work.imagePosition,
        beforeImage: work.beforeImageUrl,
        beforeImageAlt: `Antes del trabajo realizado por ${professional.name}`,
        beforeImagePosition: work.beforeImagePosition,
        afterImage: work.afterImageUrl,
        afterImageAlt: `Después del trabajo realizado por ${professional.name}`,
        afterImagePosition: work.afterImagePosition,
        active: work.active,
        order: work.displayOrder,
      })),
  }
}

function toPublicProduct(product: AdminProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category as ProductCategory,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    image: product.imageUrl || '/images/products/tratamiento.svg',
    imageAlt: `Presentación de ${product.name}`,
    imagePosition: product.imagePosition,
    featured: product.featured,
    active: product.active,
    displayOrder: product.displayOrder,
    price: product.price ?? undefined,
    stockStatus: product.stockStatus || undefined,
  }
}

export async function loadPublicContent(): Promise<PublicContent> {
  if (!supabaseConfiguration.configured) {
    return {
      styles: fallbackStyles.filter((item) => item.active),
      professionals: fallbackProfessionals.filter((item) => item.active),
      products: fallbackProducts.filter((item) => item.active),
      categories: [],
      settings: fallbackSiteSettings,
      source: 'fallback',
    }
  }
  const [categories, styles, professionals, settings, products] = await Promise.all([
    categoriesService.list(false),
    stylesService.list(false),
    professionalsService.list(false),
    settingsService.get(),
    productsService.list(false).catch(() => []),
  ])
  return {
    categories,
    styles: styles.map((item) => toPublicStyle(item, categories)).filter((item): item is Style => Boolean(item)),
    professionals: professionals.map(toPublicProfessional),
    products: products.length ? products.map(toPublicProduct) : fallbackProducts.filter((item) => item.active),
    settings,
    source: 'supabase',
  }
}
