import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const siteUrl = 'https://www.marilyncoiffure.com'
const socialImage = `${siteUrl}/images/home/marilyn-portada.jpeg`
const outputDirectory = new URL('../dist/', import.meta.url)
const templatePath = new URL('../dist/index.html', import.meta.url)

const corePages = [
  {
    path: '/',
    title: 'Marilyn Coiffure | Peluquería en Villarrica',
    description: 'Marilyn Coiffure en Villarrica. Peinados, coloración, cortes y cuidado capilar con atención personalizada.',
  },
  {
    path: '/estilos',
    title: 'Peinados, cortes y coloración | Marilyn Coiffure',
    description: 'Descubrí peinados, cortes y estilos disponibles en Marilyn Coiffure, Villarrica.',
  },
  {
    path: '/profesionales',
    title: 'Profesionales | Marilyn Coiffure Villarrica',
    description: 'Conocé a los profesionales de Marilyn Coiffure y elegí con quién querés realizar tu próximo estilo.',
  },
  {
    path: '/productos',
    title: 'Productos para el cuidado del cabello | Marilyn Coiffure',
    description: 'Descubrí productos seleccionados para el cuidado de tu cabello disponibles en Marilyn Coiffure.',
  },
  {
    path: '/consulta',
    title: 'Consultar disponibilidad | Marilyn Coiffure',
    description: 'Consultá disponibilidad para tu próxima atención en Marilyn Coiffure, Villarrica.',
  },
]

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const escapeXml = escapeHtml

async function loadActiveDetailPages() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[SEO] Supabase no está configurado durante el build; el sitemap incluirá solo rutas públicas estables.')
    return []
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const [stylesResult, professionalsResult] = await Promise.all([
    client.from('styles').select('slug,name,short_description').eq('active', true).order('display_order'),
    client.from('professionals').select('slug,name,short_description').eq('active', true).order('display_order'),
  ])

  if (stylesResult.error || professionalsResult.error) {
    console.warn('[SEO] No se pudieron leer todas las rutas activas de Supabase; el sitemap conservará solo rutas estables.')
    return []
  }

  const stylePages = (stylesResult.data ?? []).map((style) => ({
    path: `/estilos/${encodeURIComponent(style.slug)}`,
    title: `${style.name} | Marilyn Coiffure`,
    description: style.short_description || `Conocé ${style.name} en el catálogo de Marilyn Coiffure, Villarrica.`,
  }))
  const professionalPages = (professionalsResult.data ?? []).map((professional) => ({
    path: `/profesionales/${encodeURIComponent(professional.slug)}`,
    title: `${professional.name} | Marilyn Coiffure`,
    description: professional.short_description || `Conocé el perfil y los trabajos de ${professional.name} en Marilyn Coiffure.`,
  }))

  return [...stylePages, ...professionalPages]
}

function renderSeoBlock(page) {
  const canonical = `${siteUrl}${page.path}`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  return `<!-- SEO_META_START -->
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Marilyn Coiffure" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${socialImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${socialImage}" />
    <title>${title}</title>
    <!-- SEO_META_END -->`
}

function renderPage(template, page) {
  return template.replace(
    /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/,
    renderSeoBlock(page),
  )
}

function outputPathFor(routePath) {
  if (routePath === '/') return new URL('index.html', outputDirectory)
  return new URL(`.${routePath}.html`, outputDirectory)
}

const template = await readFile(templatePath, 'utf8')
const detailPages = await loadActiveDetailPages()
const pages = [...corePages, ...detailPages]

for (const page of pages) {
  const destination = outputPathFor(page.path)
  await mkdir(fileURLToPath(new URL('./', destination)), { recursive: true })
  await writeFile(destination, renderPage(template, page), 'utf8')
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${page.path}`)}</loc>\n  </url>`).join('\n')}
</urlset>
`
await writeFile(new URL('sitemap.xml', outputDirectory), sitemap, 'utf8')

console.info(`[SEO] Generadas ${pages.length} páginas con metadata inicial y sitemap canónico.`)
