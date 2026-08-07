export interface DatabaseCategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface DatabaseStyleRow {
  id: string
  category_id: string
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
