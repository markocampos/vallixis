import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import api from '../lib/api'

interface SiteData {
  id: string; name: string; slug: string; domain: string; template: string; vibe: string; description: string | null; config_json: Record<string, any>; owner_name: string
}

export default function SitePreview() {
  const { slug } = useParams<{ slug: string }>()
  const [site, setSite] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) fetchSite()
  }, [slug])

  const fetchSite = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ data: SiteData }>(`/sites/preview/${slug}`)
      setSite(res.data.data)
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Site not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading site...</p>
        </div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Site not found</h1>
          <p className="text-sm text-gray-500">This site doesn't exist or is not published yet.</p>
        </div>
      </div>
    )
  }

  const config = site.config_json || {}
  const sections = config.sections || {}
  const primary = config.colors?.primary || '#8B2635'
  const text = config.colors?.text || '#111827'
  const bg = config.colors?.background || '#FFFFFF'

  const renderSection = (key: string, st: any) => {
    if (key === 'hero') return (
      <div className="relative overflow-hidden" style={{ background: st.bgImage ? `url(${st.bgImage}) center/cover` : primary }}>
        {st.bgImage && <div className="absolute inset-0" style={{ background: `${primary}CC` }} />}
        <div className="relative px-8 py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{st.headline || `Welcome to ${config.businessName || site.name}`}</h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">{st.subheadline || site.description || ''}</p>
          {st.ctaText && (
            <a href={st.ctaLink || '#'} className="inline-block bg-white text-sm font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all" style={{ color: primary }}>
              {st.ctaText}
            </a>
          )}
        </div>
      </div>
    )

    if (key === 'about') return (
      <div className="px-8 py-16 max-w-4xl mx-auto" style={{ background: bg }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: text }}>{st.title || 'About Us'}</h2>
        <p className="text-base leading-relaxed text-gray-600 max-w-2xl">{st.text || ''}</p>
      </div>
    )

    if (key === 'services') return (
      <div className="px-8 py-16" style={{ background: '#F9FAFB' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: text }}>{st.title || 'Services'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(st.items || []).map((item: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${primary}10` }}>
                  <div className="w-4 h-4 rounded-full" style={{ background: primary }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: text }}>{item.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    if (key === 'contact') return (
      <div className="px-8 py-16 max-w-4xl mx-auto" style={{ background: bg }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: text }}>{st.title || 'Contact'}</h2>
        <div className="space-y-4 text-gray-600">
          {st.email && <p className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${primary}10` }}><span style={{ color: primary }}>✉</span></div><span>{st.email}</span></p>}
          {st.phone && <p className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${primary}10` }}><span style={{ color: primary }}>☎</span></div><span>{st.phone}</span></p>}
          {st.address && <p className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${primary}10` }}><span style={{ color: primary }}>📍</span></div><span>{st.address}</span></p>}
        </div>
      </div>
    )

    if (key === 'testimonials') return (
      <div className="px-8 py-16" style={{ background: '#F9FAFB' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: text }}>{st.title || 'Testimonials'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(st.items || []).map((item: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-600 italic leading-relaxed mb-4">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: primary }}>{item.name?.[0] || '?'}</div>
                  <div><p className="text-sm font-semibold" style={{ color: text }}>{item.name}</p><p className="text-xs text-gray-400">{item.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    if (key === 'faq') return (
      <div className="px-8 py-16 max-w-3xl mx-auto" style={{ background: bg }}>
        <h2 className="text-2xl font-bold mb-8" style={{ color: text }}>{st.title || 'FAQ'}</h2>
        <div className="space-y-1">
          {(st.items || []).map((item: any, i: number) => (
            <div key={i} className="border-b border-gray-100 py-5">
              <p className="text-base font-semibold mb-2" style={{ color: text }}>{item.question}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    )

    if (key === 'cta') return (
      <div className="px-8 py-20 text-center" style={{ background: primary }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">{st.title || 'Ready to get started?'}</h2>
          {st.buttonText && (
            <a href={st.buttonLink || '#'} className="inline-block bg-white text-sm font-semibold px-8 py-3.5 rounded-lg shadow-lg" style={{ color: primary }}>
              {st.buttonText}
            </a>
          )}
        </div>
      </div>
    )

    if (key === 'custom') return <div className="px-8 py-8" dangerouslySetInnerHTML={{ __html: st.html || '' }} />
    return null
  }

  return (
    <>
      <PageMeta title={config.seo?.title || site.name} description={config.seo?.description || site.description || ''} />
      <div style={{ background: config.colors?.background || '#FFFFFF', fontFamily: config.typography?.bodyFont || 'Inter', fontSize: `${config.typography?.baseSize || 16}px` }}>
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
          <span className="text-base font-bold" style={{ color: text, fontFamily: config.typography?.headingFont || 'Inter' }}>
            {config.businessName || site.name}
          </span>
          <div className="flex gap-6 text-sm text-gray-500 font-medium">
            {Object.keys(sections).filter(k => k !== 'hero').map(k => (
              <a key={k} href={`#${k}`} className="hover:text-primary transition-colors capitalize">{sections[k]?.title || k}</a>
            ))}
          </div>
        </nav>

        {/* Sections */}
        {Object.entries(sections).map(([key, st]) => (
          <div key={key} id={key}>
            {renderSection(key, st as any)}
          </div>
        ))}

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2026 {config.businessName || site.name} · Built with <a href="https://vallixis.io" className="text-primary hover:underline">Vallixis</a>
        </div>
      </div>
    </>
  )
}
