export interface DatabaseCategoryRow {
  id: string
  parent_category_id: string | null
  name: string
  slug: string
  description: string | null
  icon: string | null
  cover_image_url: string | null
  cover_image_path: string | null
  cover_image_zoom: number | null
  cover_image_position_x: number | null
  cover_image_position_y: number | null
  cta_label: string | null
  cta_href: string | null
  active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface DatabaseStyleRow {
  id: string
  category_id: string
  subcategory_id: string | null
  name: string
  slug: string
  short_description: string | null
  full_description: string | null
  image_url: string | null
  image_path: string | null
  image_zoom: number | null
  image_position_x: number | null
  image_position_y: number | null
  tags: string[] | null
  featured: boolean
  active: boolean
  display_order: number
  estimated_duration: string | null
  price_from: number | null
}

export interface DatabaseProfessionalRow {
  id: string
  name: string
  slug: string
  role: string | null
  short_description: string | null
  full_description: string | null
  image_url: string | null
  image_path: string | null
  image_zoom: number | null
  image_position_x: number | null
  image_position_y: number | null
  whatsapp_number: string | null
  specialties: string[] | null
  featured: boolean
  active: boolean
  display_order: number
  availability_note: string | null
  instagram_url: string | null
}

export interface DatabaseProfessionalWorkRow {
  id: string
  professional_id: string
  work_type: 'photo' | 'before_after'
  title: string | null
  image_url: string | null
  image_path: string | null
  image_zoom: number | null
  image_position_x: number | null
  image_position_y: number | null
  before_image_url: string | null
  before_image_path: string | null
  before_image_zoom: number | null
  before_image_position_x: number | null
  before_image_position_y: number | null
  after_image_url: string | null
  after_image_path: string | null
  after_image_zoom: number | null
  after_image_position_x: number | null
  after_image_position_y: number | null
  active: boolean
  display_order: number
}

export interface DatabaseProductRow {
  id: string
  name: string
  slug: string
  category: string | null
  short_description: string | null
  full_description: string | null
  image_url: string | null
  image_path: string | null
  image_zoom: number | null
  image_position_x: number | null
  image_position_y: number | null
  featured: boolean
  active: boolean
  display_order: number
  price: number | null
  stock_status: string | null
}

export interface DatabaseSettingRow {
  id: string
  key: string
  value: unknown
  updated_at: string
}
