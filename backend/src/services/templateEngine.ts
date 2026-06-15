import fs from 'fs'
import path from 'path'

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates')

interface SiteConfig {
  businessName: string
  description: string
  vibe: string
  template: string
  domain: string
  logo?: string | null
  sections?: Record<string, any>
  seo?: { title?: string; description?: string; keywords?: string; ogImage?: string }
  colors?: { primary?: string; background?: string; text?: string }
  typography?: { headingFont?: string; bodyFont?: string; baseSize?: number; borderRadius?: number }
  integrations?: { ga4Id?: string; facebookPixel?: string; customHead?: string }
  advanced?: { customCSS?: string; customHTML?: string }
}

function resolveTemplate(templateName: string, fileName: string): string {
  const filePath = path.join(TEMPLATES_DIR, templateName, fileName)
  if (!fs.existsSync(filePath)) {
    const fallback = path.join(TEMPLATES_DIR, 'business', fileName)
    if (fs.existsSync(fallback)) return fs.readFileSync(fallback, 'utf-8')
    return ''
  }
  return fs.readFileSync(filePath, 'utf-8')
}

function readShared(fileName: string): string {
  const filePath = path.join(TEMPLATES_DIR, 'shared', fileName)
  if (!fs.existsSync(filePath)) return ''
  return fs.readFileSync(filePath, 'utf-8')
}

function renderMustache(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key: string) => {
    const trimmed = key.trim()
    const parts = trimmed.split('.')
    let value: any = data
    for (const part of parts) {
      if (value == null) return ''
      value = value[part]
    }
    return value != null ? String(value) : ''
  })
}

function buildSections(config: SiteConfig): string {
  const sections = config.sections || {}
  const primary = config.colors?.primary || '#8B2635'
  const textColor = config.colors?.text || '#111827'
  const bgColor = config.colors?.background || '#FFFFFF'

  const sectionHtml: string[] = []

  // Hero section
  const hero = sections.hero || {}
  if (hero.headline || hero.subheadline) {
    const bgStyle = hero.bgImage
      ? `background: url('${hero.bgImage}') center/cover no-repeat; position: relative;`
      : `background: ${primary};`
    const overlay = hero.bgImage ? `<div style="position:absolute;inset:0;background:${primary}CC;"></div>` : ''
    sectionHtml.push(`
      <section id="hero" style="${bgStyle}">
        ${overlay}
        <div style="position:relative;padding:5rem 1.5rem;text-align:center;color:#fff;">
          <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:1rem;line-height:1.2;">${hero.headline || `Welcome to ${config.businessName}`}</h1>
          <p style="font-size:1.1rem;opacity:0.85;max-width:600px;margin:0 auto 2rem;">${hero.subheadline || config.description || ''}</p>
          ${hero.ctaText ? `<a href="${hero.ctaLink || '#contact'}" style="display:inline-block;background:#fff;color:${primary};padding:0.875rem 2rem;border-radius:0.5rem;font-weight:600;text-decoration:none;transition:box-shadow 0.2s;">${hero.ctaText}</a>` : ''}
        </div>
      </section>`)
  }

  // About section
  const about = sections.about || {}
  if (about.text || about.title) {
    sectionHtml.push(`
      <section id="about" style="padding:4rem 1.5rem;background:${bgColor};">
        <div style="max-width:900px;margin:0 auto;">
          <h2 style="font-size:1.75rem;font-weight:700;color:${textColor};margin-bottom:1rem;">${about.title || 'About Us'}</h2>
          <p style="color:#4B5563;line-height:1.8;max-width:700px;">${about.text || ''}</p>
          ${about.image ? `<img src="${about.image}" alt="${about.title || 'About'}" style="margin-top:1.5rem;max-width:100%;border-radius:0.75rem;" />` : ''}
        </div>
      </section>`)
  }

  // Services section
  const services = sections.services || {}
  const serviceItems = services.items || []
  if (serviceItems.length > 0 || services.title) {
    const cards = serviceItems.map((item: any) => `
      <div style="background:#fff;padding:1.5rem;border-radius:0.75rem;border:1px solid #F3F4F6;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;background:${primary}10;display:flex;align-items:center;justify-content:center;margin-bottom:0.75rem;">
          <div style="width:0.75rem;height:0.75rem;border-radius:50%;background:${primary};"></div>
        </div>
        <h3 style="font-size:1rem;font-weight:600;color:${textColor};margin-bottom:0.5rem;">${item.name || ''}</h3>
        <p style="font-size:0.875rem;color:#6B7280;line-height:1.6;">${item.description || ''}</p>
      </div>`).join('')
    sectionHtml.push(`
      <section id="services" style="padding:4rem 1.5rem;background:#F9FAFB;">
        <div style="max-width:900px;margin:0 auto;">
          <h2 style="font-size:1.75rem;font-weight:700;color:${textColor};margin-bottom:1.5rem;">${services.title || 'Our Services'}</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;">${cards}</div>
        </div>
      </section>`)
  }

  // Testimonials section
  const testimonials = sections.testimonials || {}
  const testimonialItems = testimonials.items || []
  if (testimonialItems.length > 0 || testimonials.title) {
    const quotes = testimonialItems.map((item: any) => `
      <div style="background:#fff;padding:1.5rem;border-radius:0.75rem;border:1px solid #F3F4F6;">
        <p style="font-size:0.9rem;color:#4B5563;line-height:1.7;font-style:italic;">"${item.quote || ''}"</p>
        <div style="display:flex;align-items:center;gap:0.75rem;margin-top:1rem;">
          <div style="width:2rem;height:2rem;border-radius:50%;background:${primary};display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:700;">${item.name?.[0] || '?'}</div>
          <div><p style="font-size:0.8rem;font-weight:600;color:${textColor};margin:0;">${item.name || ''}</p><p style="font-size:0.7rem;color:#9CA3AF;margin:0;">${item.role || ''}</p></div>
        </div>
      </div>`).join('')
    sectionHtml.push(`
      <section id="testimonials" style="padding:4rem 1.5rem;background:#F9FAFB;">
        <div style="max-width:900px;margin:0 auto;">
          <h2 style="font-size:1.75rem;font-weight:700;color:${textColor};margin-bottom:1.5rem;">${testimonials.title || 'Testimonials'}</h2>
          <div style="display:grid;gap:1rem;">${quotes}</div>
        </div>
      </section>`)
  }

  // FAQ section
  const faq = sections.faq || {}
  const faqItems = faq.items || []
  if (faqItems.length > 0 || faq.title) {
    const items = faqItems.map((item: any) => `
      <details style="border-bottom:1px solid #E5E7EB;padding:1.25rem 0;">
        <summary style="font-size:0.95rem;font-weight:600;color:${textColor};cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;">
          ${item.question || ''}
          <span style="color:#9CA3AF;font-size:0.8rem;">+</span>
        </summary>
        <p style="font-size:0.875rem;color:#6B7280;line-height:1.7;margin-top:0.75rem;">${item.answer || ''}</p>
      </details>`).join('')
    sectionHtml.push(`
      <section id="faq" style="padding:4rem 1.5rem;background:${bgColor};">
        <div style="max-width:700px;margin:0 auto;">
          <h2 style="font-size:1.75rem;font-weight:700;color:${textColor};margin-bottom:1.5rem;">${faq.title || 'FAQ'}</h2>
          ${items}
        </div>
      </section>`)
  }

  // Contact section
  const contact = sections.contact || {}
  if (contact.email || contact.phone || contact.address || contact.title) {
    const items = [
      contact.email ? `<p style="display:flex;align-items:center;gap:0.75rem;"><span style="display:inline-flex;width:2rem;height:2rem;border-radius:0.5rem;background:${primary}10;align-items:center;justify-content:center;font-size:0.8rem;">✉</span> ${contact.email}</p>` : '',
      contact.phone ? `<p style="display:flex;align-items:center;gap:0.75rem;"><span style="display:inline-flex;width:2rem;height:2rem;border-radius:0.5rem;background:${primary}10;align-items:center;justify-content:center;font-size:0.8rem;">☎</span> ${contact.phone}</p>` : '',
      contact.address ? `<p style="display:flex;align-items:center;gap:0.75rem;"><span style="display:inline-flex;width:2rem;height:2rem;border-radius:0.5rem;background:${primary}10;align-items:center;justify-content:center;font-size:0.8rem;">📍</span> ${contact.address}</p>` : ''
    ].filter(Boolean).join('')
    sectionHtml.push(`
      <section id="contact" style="padding:4rem 1.5rem;background:${bgColor};">
        <div style="max-width:700px;margin:0 auto;">
          <h2 style="font-size:1.75rem;font-weight:700;color:${textColor};margin-bottom:1.5rem;">${contact.title || 'Contact Us'}</h2>
          <div style="display:flex;flex-direction:column;gap:1rem;font-size:0.9rem;color:#4B5563;">${items}</div>
        </div>
      </section>`)
  }

  // CTA section
  const cta = sections.cta || {}
  if (cta.title || cta.buttonText) {
    sectionHtml.push(`
      <section id="cta" style="padding:4rem 1.5rem;background:${primary};text-align:center;">
        <h2 style="font-size:1.75rem;font-weight:700;color:#fff;margin-bottom:1.5rem;">${cta.title || 'Ready to get started?'}</h2>
        ${cta.buttonText ? `<a href="${cta.buttonLink || '#contact'}" style="display:inline-block;background:#fff;color:${primary};padding:0.875rem 2rem;border-radius:0.5rem;font-weight:600;text-decoration:none;">${cta.buttonText}</a>` : ''}
      </section>`)
  }

  // Custom HTML section
  const custom = sections.custom || {}
  if (custom.html) {
    sectionHtml.push(`<section id="custom" style="padding:2rem 1.5rem;">${custom.html}</section>`)
  }

  return sectionHtml.join('\n')
}

export function renderSite(config: SiteConfig): string {
  const templateName = config.template || 'business'
  const vibe = config.vibe || 'modern'
  const primary = config.colors?.primary || '#8B2635'
  const bgColor = config.colors?.background || '#FFFFFF'
  const textColor = config.colors?.text || '#111827'
  const headingFont = config.typography?.headingFont || 'Inter'
  const bodyFont = config.typography?.bodyFont || 'Inter'
  const baseSize = config.typography?.baseSize || 16
  const borderRadius = config.typography?.borderRadius || 8

  const seo = config.seo || {}
  const integrations = config.integrations || {}
  const advanced = config.advanced || {}

  // Read vibe CSS
  const vibeCss = readShared(`vibes/${vibe}.css`)

  // Build sections HTML
  const sectionsHtml = buildSections(config)

  // Logo HTML
  const logoHtml = config.logo
    ? `<img src="${config.logo}" alt="${config.businessName}" style="height:2rem;" />`
    : `<div style="width:2rem;height:2rem;border-radius:0.375rem;background:${primary};display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:700;">${config.businessName?.[0] || 'V'}</div>`

  // Navigation items from sections
  const navItems = Object.entries(config.sections || {})
    .filter(([key]) => key !== 'hero' && key !== 'custom')
    .map(([, val]) => `<a href="#${val.id || ''}" style="color:#6B7280;text-decoration:none;font-size:0.875rem;font-weight:500;transition:color 0.2s;">${val.title || ''}</a>`)
    .join('')

  // Analytics scripts
  const gaScript = integrations.ga4Id ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${integrations.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${integrations.ga4Id}');</script>` : ''
  const fbScript = integrations.facebookPixel ? `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${integrations.facebookPixel}');fbq('track','PageView');</script>` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo.title || config.businessName}</title>
  <meta name="description" content="${seo.description || config.description || ''}">
  ${seo.keywords ? `<meta name="keywords" content="${seo.keywords}">` : ''}
  ${seo.ogImage ? `<meta property="og:image" content="${seo.ogImage}">` : ''}
  <meta property="og:title" content="${seo.title || config.businessName}">
  <meta property="og:description" content="${seo.description || config.description || ''}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, '+')}:wght@400;500;600;700&family=${bodyFont.replace(/ /g, '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: '${bodyFont}', sans-serif; font-size: ${baseSize}px; color: ${textColor}; background: ${bgColor}; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    h1, h2, h3, h4, h5, h6 { font-family: '${headingFont}', sans-serif; }
    a { color: ${primary}; }
    img { max-width: 100%; height: auto; }
    ${vibeCss}
    ${advanced.customCSS || ''}
  </style>
  ${gaScript}
  ${fbScript}
  ${integrations.customHead || ''}
</head>
<body>
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid #E5E7EB;background:${bgColor};position:sticky;top:0;z-index:100;">
    <div style="display:flex;align-items:center;gap:0.5rem;">
      ${logoHtml}
      <span style="font-weight:700;font-size:1rem;color:${textColor};">${config.businessName}</span>
    </div>
    <div style="display:flex;gap:1.5rem;">${navItems}</div>
  </nav>

  ${sectionsHtml}

  <footer style="padding:1.5rem;text-align:center;border-top:1px solid #E5E7EB;color:#9CA3AF;font-size:0.8rem;">
    &copy; ${new Date().getFullYear()} ${config.businessName}. Made with <a href="https://vallixis.io" style="color:${primary};font-weight:600;text-decoration:none;">Vallixis</a>
  </footer>

  ${advanced.customHTML || ''}
</body>
</html>`

  return html
}

export function renderSiteFiles(config: SiteConfig): { html: string; css: string; js: string } {
  const html = renderSite(config)
  const css = readShared('utilities.css') + '\n' + readShared(`vibes/${config.vibe || 'modern'}.css`)
  const js = resolveTemplate(config.template || 'business', 'script.js')
  return { html, css, js }
}
