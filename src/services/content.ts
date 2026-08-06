import { siteConfig } from '../config/site'
import { professionals as fallbackProfessionals } from '../data/professionals'
import { products as fallbackProducts } from '../data/products'
import { siteContent } from '../data/siteContent'
import { styles as fallbackStyles } from '../data/styles'
import { requireSupabase, supabaseConfiguration } from '../lib/supabase'
import type { Professional, ProfessionalSpecialty } from '../types/professional'
import type { Product, ProductCategory } from '../types/product'
import type { Style, StyleCategory } from '../types/style'
import type {
  AdminProfessional,
  AdminProduct,
  AdminStyle,
  Category,
  DashboardSummary,
  SiteSettings,
} from '../types/admin'
import type {
  DatabaseCategoryRow,
  DatabaseProfessionalRow,
  DatabaseProductRow,
  DatabaseSettingRow,
  DatabaseStyleRow,
} from '../types/database'
import { humanizeDataError } from '../utils/admin'

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
  aboutTitle: siteContent.about.title,
  aboutText: siteContent.about.paragraphs.join('\n\n'),
  ctaTitle: siteContent.contact.title,
  ctaDescription: siteContent.contact.description,
  formDisclaimer: siteConfig.consultation.disclaimer,
  address: '',
  openingHours: '',
  seoTitle: 'Marilyn Coiffure | Belleza y estilo',
  seoDescription: 'Coloración, peinados y cuidado capilar con atención personalizada en Marilyn Coiffure.',
  specialties: siteContent.specialties.map(({ title, description }) => ({ title, description })),
}

const sortByOrderAndName = <Item extends { displayOrder: number; name: string }>(items: Item[]) =>
  items.sort((first, second) => first.displayOrder - second.displayOrder || first.name.localeCompare(second.name, 'es'))

function mapCategory(row: DatabaseCategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    icon: row.icon ?? '',
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
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description ?? '',
    fullDescription: row.full_description ?? '',
    imageUrl: row.image_url ?? '',
    imagePath: row.image_path ?? '',
    tags: row.tags ?? [],
    featured: row.featured,
    active: row.active,
    displayOrder: row.display_order,
    estimatedDuration: row.estimated_duration ?? '',
    priceFrom: row.price_from,
    professionalIds,
  }
}

function mapAdminProfessional(row: DatabaseProfessionalRow, styleIds: string[]): AdminProfessional {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    role: row.role ?? '',
    shortDescription: row.short_description ?? '',
    fullDescription: row.full_description ?? '',
    imageUrl: row.image_url ?? '',
    imagePath: row.image_path ?? '',
    whatsappNumber: row.whatsapp_number ?? '',
    specialties: row.specialties ?? [],
    featured: row.featured,
    active: row.active,
    displayOrder: row.display_order,
    availabilityNote: row.availability_note ?? '',
    instagramUrl: row.instagram_url ?? '',
    styleIds,
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
      name: category.name.trim(),
      slug: category.slug.trim(),
      description: category.description.trim() || null,
      icon: category.icon.trim() || null,
      active: category.active,
      display_order: category.displayOrder,
    }
    const { data, error } = await client.from('categories').upsert(payload).select('*').single()
    if (error) throw new Error(humanizeDataError(error, 'No se pudo guardar la categoría.'))
    return mapCategory(data as DatabaseCategoryRow)
  },
  async remove(categoryId: string) {
    const client = requireSupabase()
    const { count, error: countError } = await client
      .from('styles')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', categoryId)
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
      name: style.name.trim(),
      slug: style.slug.trim(),
      short_description: style.shortDescription.trim() || null,
      full_description: style.fullDescription.trim() || null,
      image_url: style.imageUrl || null,
      image_path: style.imagePath || null,
      tags: style.tags,
      featured: style.featured,
      active: style.active,
      display_order: style.displayOrder,
      estimated_duration: style.estimatedDuration.trim() || null,
      price_from: style.priceFrom,
    }
    const { data, error } = await client.from('styles').upsert(payload).select('*').single()
    if (error) throw new Error(humanizeDataError(error, 'No se pudo guardar el estilo.'))
    const saved = data as DatabaseStyleRow
    const { error: deleteError } = await client.from('style_professionals').delete().eq('style_id', saved.id)
    if (deleteError) throw new Error('El estilo se guardó, pero no se pudieron actualizar sus profesionales.')
    if (style.professionalIds.length) {
      const { error: relationError } = await client.from('style_professionals').insert(
        style.professionalIds.map((professionalId) => ({ style_id: saved.id, professional_id: professionalId })),
      )
      if (relationError) throw new Error('El estilo se guardó, pero no se pudieron actualizar sus profesionales.')
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
    const [{ data, error }, relations] = await Promise.all([query, getRelations()])
    if (error) throw new Error(humanizeDataError(error, 'No pudimos cargar las profesionales.'))
    return ((data ?? []) as DatabaseProfessionalRow[]).map((row) => mapAdminProfessional(
      row,
      relations.filter((relation) => relation.professional_id === row.id).map((relation) => relation.style_id),
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
    return mapAdminProfessional(saved, professional.styleIds)
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
  const category = categories.find((item) => item.id === style.categoryId)
  if (!category) return null
  return {
    id: style.id,
    slug: style.slug,
    name: style.name,
    category: category.name as StyleCategory,
    shortDescription: style.shortDescription,
    fullDescription: style.fullDescription,
    image: style.imageUrl || '/images/styles/corte-bob.svg',
    imageAlt: `Referencia visual para ${style.name}`,
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
    whatsappNumber: professional.whatsappNumber,
    active: professional.active,
    featured: professional.featured,
    order: professional.displayOrder,
    styleIds: professional.styleIds,
    availabilityNote: professional.availabilityNote,
    instagramUrl: professional.instagramUrl,
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
