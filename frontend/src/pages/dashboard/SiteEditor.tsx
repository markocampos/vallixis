import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Modal from '../../components/Modal'
import {
  ArrowLeft, Save, Monitor, Tablet, Smartphone, RefreshCw, Plus, Trash2,
  ChevronDown, ChevronUp, Type, Paintbrush, Search, FileCode, Settings,
  Eye, EyeOff, Undo2, Redo2, ExternalLink, Check, Loader2, Copy, Layers
} from 'lucide-react'
import api from '../../lib/api'

type Tab = 'content' | 'style' | 'seo' | 'code' | 'settings'

interface SiteData {
  id: string; name: string; slug: string; domain: string; template: string; vibe: string; description: string | null; status: string; config_json: Record<string, any>
}

interface PageSection {
  id: string; type: string; title: string; settings: Record<string, any>
}

const sectionTypes = [
  { value: 'hero', label: 'Hero Section', icon: '🎯' },
  { value: 'about', label: 'About Us', icon: '📖' },
  { value: 'services', label: 'Services', icon: '💼' },
  { value: 'testimonials', label: 'Testimonials', icon: '💬' },
  { value: 'faq', label: 'FAQ', icon: '❓' },
  { value: 'cta', label: 'Call to Action', icon: '🔔' },
  { value: 'contact', label: 'Contact Info', icon: '📧' },
  { value: 'custom', label: 'Custom HTML', icon: '🔧' },
]

const defaultSections: PageSection[] = [
  { id: 'hero', type: 'hero', title: 'Hero', settings: { headline: '', subheadline: '', ctaText: 'Get Started', ctaLink: '#contact', bgImage: '' } },
  { id: 'about', type: 'about', title: 'About', settings: { title: 'About Us', text: '', image: '' } },
  { id: 'services', type: 'services', title: 'Services', settings: { title: 'Our Services', items: [] } },
  { id: 'contact', type: 'contact', title: 'Contact', settings: { title: 'Contact Us', email: '', phone: '', address: '' } },
]

export default function SiteEditor() {
  const { id } = useParams<{ id: string }>()
  const [site, setSite] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tab, setTab] = useState<Tab>('content')
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [config, setConfig] = useState<Record<string, any>>({})
  const [sections, setSections] = useState<PageSection[]>(defaultSections)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [customCSS, setCustomCSS] = useState('')
  const [customHTML, setCustomHTML] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => { if (id) fetchSite() }, [id])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSave() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); handleRedo() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sections, config, customCSS, customHTML])

  const fetchSite = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ data: SiteData }>(`/sites/${id}`)
      const siteData = res.data.data
      setSite(siteData)
      const cfg = siteData.config_json || {}
      setConfig(cfg)
      setCustomCSS(cfg.advanced?.customCSS || '')
      setCustomHTML(cfg.advanced?.customHTML || '')
      if (cfg.sections && Object.keys(cfg.sections).length > 0) {
        const loaded = Object.entries(cfg.sections).map(([key, val]: [string, any]) => ({
          id: key, type: key, title: val.title || key.charAt(0).toUpperCase() + key.slice(1), settings: val
        }))
        setSections(loaded)
        setActiveSection(loaded[0]?.id || null)
      } else { setActiveSection('hero') }
      setLastSaved(new Date())
      setHasChanges(false)
    } catch (err: any) { setError(err.response?.data?.errors?.[0]?.message || 'Failed to load') }
    finally { setLoading(false) }
  }

  const trackChange = useCallback(() => {
    setHasChanges(true)
    setUndoStack((prev) => [...prev.slice(-19), { sections: JSON.parse(JSON.stringify(sections)), config: JSON.parse(JSON.stringify(config)), customCSS, customHTML }])
    setRedoStack([])
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => autoSave(), 3000)
  }, [sections, config, customCSS, customHTML])

  const handleUndo = () => {
    if (!undoStack.length) return
    const prev = undoStack[undoStack.length - 1]
    setRedoStack((r) => [...r, { sections: JSON.parse(JSON.stringify(sections)), config: JSON.parse(JSON.stringify(config)), customCSS, customHTML }])
    setSections(prev.sections); setConfig(prev.config); setCustomCSS(prev.customCSS); setCustomHTML(prev.customHTML)
    setUndoStack((u) => u.slice(0, -1))
  }

  const handleRedo = () => {
    if (!redoStack.length) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack((u) => [...u, { sections: JSON.parse(JSON.stringify(sections)), config: JSON.parse(JSON.stringify(config)), customCSS, customHTML }])
    setSections(next.sections); setConfig(next.config); setCustomCSS(next.customCSS); setCustomHTML(next.customHTML)
    setRedoStack((r) => r.slice(0, -1))
  }

  const autoSave = async () => {
    if (!hasChanges) return
    setAutoSaving(true)
    try {
      const s: Record<string, any> = {}
      sections.forEach((sec) => { s[sec.id] = { ...sec.settings, title: sec.title } })
      await api.put(`/sites/${id}`, { name: config.businessName || site?.name, description: config.description, config_json: { ...config, sections: s, advanced: { customCSS, customHTML } } })
      setLastSaved(new Date()); setHasChanges(false)
    } catch { }
    finally { setAutoSaving(false) }
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const s: Record<string, any> = {}
      sections.forEach((sec) => { s[sec.id] = { ...sec.settings, title: sec.title } })
      await api.put(`/sites/${id}`, { name: config.businessName || site?.name, description: config.description, config_json: { ...config, sections: s, advanced: { customCSS, customHTML } } })
      setSuccess('Saved'); setLastSaved(new Date()); setHasChanges(false); fetchSite()
      setTimeout(() => setSuccess(''), 2500)
    } catch (err: any) { setError(err.response?.data?.errors?.[0]?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDeploy = async () => {
    setSaving(true); setError('')
    try { await handleSave(); await api.post(`/sites/${id}/deploy`); setSuccess('Deploying...'); fetchSite() }
    catch (err: any) { setError(err.response?.data?.errors?.[0]?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (deleteConfirm !== site?.name) return
    try { await api.delete(`/sites/${id}`); window.location.href = '/dashboard/sites' }
    catch (err: any) { setError(err.response?.data?.errors?.[0]?.message || 'Failed') }
  }

  const updateSection = (sectionId: string, key: string, value: any) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, settings: { ...s.settings, [key]: value } } : s))
    trackChange()
  }

  const addSection = (type: string) => {
    const defaults: Record<string, any> = {
      hero: { headline: '', subheadline: '', ctaText: 'Get Started', ctaLink: '#contact' },
      about: { title: 'About Us', text: '', image: '' },
      services: { title: 'Our Services', items: [{ name: 'Service 1', description: '' }] },
      contact: { title: 'Contact Us', email: '', phone: '', address: '' },
      testimonials: { title: 'Testimonials', items: [{ name: '', role: '', quote: '' }] },
      faq: { title: 'FAQ', items: [{ question: '', answer: '' }] },
      cta: { title: 'Ready to get started?', buttonText: 'Get Started', buttonLink: '#contact' },
      custom: { title: 'Custom Section', html: '' },
    }
    const newId = `${type}-${Date.now()}`
    setSections((prev) => [...prev, { id: newId, type, title: sectionTypes.find(t => t.value === type)?.label || type, settings: defaults[type] || {} }])
    setActiveSection(newId); setTab('content')
  }

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
    if (activeSection === sectionId) setActiveSection(sections[0]?.id || null)
    trackChange()
  }

  const moveSection = (sectionId: string, dir: 'up' | 'down') => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId)
      const newIdx = dir === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const arr = [...prev]; [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      return arr
    })
    trackChange()
  }

  const deviceWidth = { desktop: '100%', tablet: '768px', mobile: '375px' }[device]
  const active = sections.find((s) => s.id === activeSection)

  const renderPreview = () => sections.map((s) => {
    const st = s.settings; const primary = config.colors?.primary || '#8B2635'; const text = config.colors?.text || '#111827'; const bg = config.colors?.background || '#FFFFFF'
    if (s.type === 'hero') return (
      <div key={s.id} className="relative overflow-hidden" style={{ background: st.bgImage ? `url(${st.bgImage}) center/cover` : primary }}>
        {st.bgImage && <div className="absolute inset-0" style={{ background: `${primary}CC` }} />}
        <div className="relative px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{st.headline || `Welcome to ${config.businessName || site?.name}`}</h1>
          <p className="text-sm text-white/80 mb-6 max-w-lg mx-auto leading-relaxed">{st.subheadline || config.description || 'Your business description'}</p>
          {st.ctaText && <button className="bg-white text-sm font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow" style={{ color: primary }}>{st.ctaText}</button>}
        </div>
      </div>
    )
    if (s.type === 'about') return (
      <div key={s.id} className="px-8 py-12" style={{ background: bg }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: text }}>{st.title || 'About Us'}</h2>
        <p className="text-sm leading-relaxed text-gray-600 max-w-2xl">{st.text || 'Tell your story here.'}</p>
      </div>
    )
    if (s.type === 'services') return (
      <div key={s.id} className="px-8 py-12" style={{ background: '#F9FAFB' }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: text }}>{st.title || 'Services'}</h2>
        <div className="grid grid-cols-2 gap-4">
          {(st.items || []).map((item: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${primary}10` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: primary }} />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: text }}>{item.name}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
    if (s.type === 'contact') return (
      <div key={s.id} className="px-8 py-12" style={{ background: bg }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: text }}>{st.title || 'Contact'}</h2>
        <div className="space-y-3 text-sm text-gray-600">
          {st.email && <p className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${primary}10` }}><span className="text-xs" style={{ color: primary }}>✉</span></div>{st.email}</p>}
          {st.phone && <p className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${primary}10` }}><span className="text-xs" style={{ color: primary }}>☎</span></div>{st.phone}</p>}
          {st.address && <p className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${primary}10` }}><span className="text-xs" style={{ color: primary }}>📍</span></div>{st.address}</p>}
        </div>
      </div>
    )
    if (s.type === 'testimonials') return (
      <div key={s.id} className="px-8 py-12" style={{ background: '#F9FAFB' }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: text }}>{st.title || 'Testimonials'}</h2>
        <div className="space-y-3">
          {(st.items || []).map((item: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600 italic leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: primary }}>{item.name?.[0] || '?'}</div>
                <div><p className="text-xs font-semibold" style={{ color: text }}>{item.name}</p><p className="text-[10px] text-gray-400">{item.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
    if (s.type === 'faq') return (
      <div key={s.id} className="px-8 py-12" style={{ background: bg }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: text }}>{st.title || 'FAQ'}</h2>
        <div className="space-y-1">
          {(st.items || []).map((item: any, i: number) => (
            <div key={i} className="border-b border-gray-100 py-4">
              <p className="text-sm font-semibold mb-1" style={{ color: text }}>{item.question}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    )
    if (s.type === 'cta') return (
      <div key={s.id} className="px-8 py-16 text-center" style={{ background: primary }}>
        <h2 className="text-xl font-bold text-white mb-4">{st.title || 'Ready to get started?'}</h2>
        {st.buttonText && <button className="bg-white text-sm font-semibold px-8 py-3 rounded-lg shadow-lg" style={{ color: primary }}>{st.buttonText}</button>}
      </div>
    )
    if (s.type === 'custom') return <div key={s.id} className="px-8 py-8" dangerouslySetInnerHTML={{ __html: st.html || '' }} />
    return null
  })

  if (loading) return <><PageMeta title="Loading..." /><div className="h-screen flex items-center justify-center bg-gray-50"><div className="flex flex-col items-center gap-3"><div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" /><p className="text-sm text-gray-400">Loading editor...</p></div></div></>
  if (!site) return <><PageMeta title="Not found" /><div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50"><p className="text-gray-500">Site not found</p><Link to="/dashboard/sites" className="btn-primary">Back to sites</Link></div></>

  return (
    <>
      <PageMeta title={`Edit ${site.name}`} />
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 px-5 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/sites" className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: config.colors?.primary || '#8B2635' }}>
                {config.businessName?.[0] || site.name[0]}
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900 leading-tight">{site.name}</h1>
                <p className="text-[11px] text-gray-400 leading-tight">{site.domain || `${site.slug}.vallixis.io`}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button onClick={handleUndo} disabled={!undoStack.length} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all" title="Undo (Ctrl+Z)"><Undo2 size={15} /></button>
              <button onClick={handleRedo} disabled={!redoStack.length} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all" title="Redo (Ctrl+Shift+Z)"><Redo2 size={15} /></button>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-[11px]">
              {autoSaving ? (
                <span className="flex items-center gap-1.5 text-gray-400"><Loader2 size={11} className="animate-spin" /> Saving</span>
              ) : hasChanges ? (
                <span className="flex items-center gap-1.5 text-amber-500"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Unsaved</span>
              ) : lastSaved ? (
                <span className="flex items-center gap-1.5 text-green-500"><Check size={11} /> Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              ) : null}
            </div>
            <a href={`/preview/${site.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all" title="Preview"><ExternalLink size={15} /></a>
            <Button variant="ghost" size="sm" onClick={handleDeploy} className="text-xs"><RefreshCw size={13} /> Deploy</Button>
            <Button size="sm" onClick={handleSave} loading={saving} className="text-xs shadow-sm"><Save size={13} /> Save</Button>
          </div>
        </header>

        {error && <div className="mx-5 mt-3 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0">{error}</div>}
        {success && <div className="mx-5 mt-3 bg-green-50 border border-green-200 text-green-600 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0"><Check size={12} /> {success}</div>}

        {/* Main */}
        <div className="flex-1 flex min-h-0">
          {/* Sections sidebar */}
          <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Sections</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{sections.length}</span>
            </div>
            <div className="flex-1 overflow-auto py-2 px-2">
              {sections.map((s) => (
                <div
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setTab('content') }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all mb-0.5 group ${
                    activeSection === s.id ? 'bg-primary/5 border border-primary/20 text-primary' : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <span className="text-xs flex-1 truncate font-medium">{s.title}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, 'up') }} className="p-0.5 rounded hover:bg-gray-200"><ChevronUp size={10} /></button>
                    <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, 'down') }} className="p-0.5 rounded hover:bg-gray-200"><ChevronDown size={10} /></button>
                    <button onClick={(e) => { e.stopPropagation(); removeSection(s.id) }} className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"><Trash2 size={10} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 py-3 border-t border-gray-100">
              <select className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" onChange={(e) => { if (e.target.value) { addSection(e.target.value); e.target.value = '' } }} defaultValue="">
                <option value="" disabled>+ Add section</option>
                {sectionTypes.map((t) => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>
          </aside>

          {/* Editor panel */}
          <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="flex border-b border-gray-100">
              {([
                { key: 'content' as Tab, icon: <Type size={13} />, label: 'Content' },
                { key: 'style' as Tab, icon: <Paintbrush size={13} />, label: 'Style' },
                { key: 'seo' as Tab, icon: <Search size={13} />, label: 'SEO' },
                { key: 'code' as Tab, icon: <FileCode size={13} />, label: 'Code' },
                { key: 'settings' as Tab, icon: <Settings size={13} />, label: 'Settings' },
              ]).map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all flex-1 justify-center ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-5">
              {tab === 'content' && active && (
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-100">
                    <Input label="Section title" value={active.title} onChange={(e) => { setSections((prev) => prev.map((s) => s.id === active.id ? { ...s, title: e.target.value } : s)); trackChange() }} />
                  </div>

                  {active.type === 'hero' && <>
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-700">Headline</label><input className="w-full text-lg font-semibold px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={active.settings.headline || ''} onChange={(e) => updateSection(active.id, 'headline', e.target.value)} placeholder="Welcome to..." /></div>
                    <Textarea label="Subheadline" value={active.settings.subheadline || ''} onChange={(e) => updateSection(active.id, 'subheadline', e.target.value)} rows={3} />
                    <Input label="CTA button text" value={active.settings.ctaText || ''} onChange={(e) => updateSection(active.id, 'ctaText', e.target.value)} />
                    <Input label="CTA link" value={active.settings.ctaLink || ''} onChange={(e) => updateSection(active.id, 'ctaLink', e.target.value)} placeholder="#contact or https://..." />
                    <Input label="Background image URL" value={active.settings.bgImage || ''} onChange={(e) => updateSection(active.id, 'bgImage', e.target.value)} placeholder="https://..." />
                  </>}

                  {active.type === 'about' && <>
                    <Input label="Title" value={active.settings.title || ''} onChange={(e) => updateSection(active.id, 'title', e.target.value)} />
                    <Textarea label="Content" value={active.settings.text || ''} onChange={(e) => updateSection(active.id, 'text', e.target.value)} rows={6} />
                    <Input label="Image URL" value={active.settings.image || ''} onChange={(e) => updateSection(active.id, 'image', e.target.value)} placeholder="https://..." />
                  </>}

                  {active.type === 'services' && <>
                    <Input label="Title" value={active.settings.title || ''} onChange={(e) => updateSection(active.id, 'title', e.target.value)} />
                    {(active.settings.items || []).map((item: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                        <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Service {i + 1}</span><button onClick={() => { const items = [...(active.settings.items || [])]; items.splice(i, 1); updateSection(active.id, 'items', items) }} className="p-1 text-gray-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 size={11} /></button></div>
                        <Input value={item.name || ''} onChange={(e) => { const items = [...(active.settings.items || [])]; items[i] = { ...items[i], name: e.target.value }; updateSection(active.id, 'items', items) }} placeholder="Name" />
                        <Textarea value={item.description || ''} onChange={(e) => { const items = [...(active.settings.items || [])]; items[i] = { ...items[i], description: e.target.value }; updateSection(active.id, 'items', items) }} rows={2} placeholder="Description" />
                      </div>
                    ))}
                    <button onClick={() => updateSection(active.id, 'items', [...(active.settings.items || []), { name: '', description: '' }])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-xs text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-medium">+ Add service</button>
                  </>}

                  {active.type === 'testimonials' && <>
                    <Input label="Title" value={active.settings.title || ''} onChange={(e) => updateSection(active.id, 'title', e.target.value)} />
                    {(active.settings.items || []).map((item: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                        <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Testimonial {i + 1}</span><button onClick={() => { const items = [...(active.settings.items || [])]; items.splice(i, 1); updateSection(active.id, 'items', items) }} className="p-1 text-gray-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 size={11} /></button></div>
                        <Input value={item.name || ''} onChange={(e) => { const items = [...(active.settings.items || [])]; items[i] = { ...items[i], name: e.target.value }; updateSection(active.id, 'items', items) }} placeholder="Name" />
                        <Input value={item.role || ''} onChange={(e) => { const items = [...(active.settings.items || [])]; items[i] = { ...items[i], role: e.target.value }; updateSection(active.id, 'items', items) }} placeholder="Role" />
                        <Textarea value={item.quote || ''} onChange={(e) => { const items = [...(active.settings.items || [])]; items[i] = { ...items[i], quote: e.target.value }; updateSection(active.id, 'items', items) }} rows={2} placeholder="Quote" />
                      </div>
                    ))}
                    <button onClick={() => updateSection(active.id, 'items', [...(active.settings.items || []), { name: '', role: '', quote: '' }])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-xs text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-medium">+ Add testimonial</button>
                  </>}

                  {active.type === 'faq' && <>
                    <Input label="Title" value={active.settings.title || ''} onChange={(e) => updateSection(active.id, 'title', e.target.value)} />
                    {(active.settings.items || []).map((item: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                        <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">FAQ {i + 1}</span><button onClick={() => { const items = [...(active.settings.items || [])]; items.splice(i, 1); updateSection(active.id, 'items', items) }} className="p-1 text-gray-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 size={11} /></button></div>
                        <Input value={item.question || ''} onChange={(e) => { const items = [...(active.settings.items || [])]; items[i] = { ...items[i], question: e.target.value }; updateSection(active.id, 'items', items) }} placeholder="Question" />
                        <Textarea value={item.answer || ''} onChange={(e) => { const items = [...(active.settings.items || [])]; items[i] = { ...items[i], answer: e.target.value }; updateSection(active.id, 'items', items) }} rows={2} placeholder="Answer" />
                      </div>
                    ))}
                    <button onClick={() => updateSection(active.id, 'items', [...(active.settings.items || []), { question: '', answer: '' }])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-xs text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-medium">+ Add FAQ</button>
                  </>}

                  {active.type === 'contact' && <>
                    <Input label="Title" value={active.settings.title || ''} onChange={(e) => updateSection(active.id, 'title', e.target.value)} />
                    <Input label="Email" value={active.settings.email || ''} onChange={(e) => updateSection(active.id, 'email', e.target.value)} type="email" />
                    <Input label="Phone" value={active.settings.phone || ''} onChange={(e) => updateSection(active.id, 'phone', e.target.value)} />
                    <Input label="Address" value={active.settings.address || ''} onChange={(e) => updateSection(active.id, 'address', e.target.value)} />
                  </>}

                  {active.type === 'cta' && <>
                    <Input label="Headline" value={active.settings.title || ''} onChange={(e) => updateSection(active.id, 'title', e.target.value)} />
                    <Input label="Button text" value={active.settings.buttonText || ''} onChange={(e) => updateSection(active.id, 'buttonText', e.target.value)} />
                    <Input label="Button link" value={active.settings.buttonLink || ''} onChange={(e) => updateSection(active.id, 'buttonLink', e.target.value)} />
                  </>}

                  {active.type === 'custom' && <Textarea label="HTML" value={active.settings.html || ''} onChange={(e) => updateSection(active.id, 'html', e.target.value)} rows={14} />}
                </div>
              )}

              {tab === 'content' && !active && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400"><Layers size={32} className="mb-3 opacity-40" /><p className="text-sm">Select a section to edit</p></div>
              )}

              {tab === 'style' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Colors</p>
                    <div className="space-y-3">
                      {[['Primary', 'primary'], ['Background', 'background'], ['Text', 'text']].map(([label, key]) => (
                        <div key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <input type="color" value={config.colors?.[key] || '#8B2635'} onChange={(e) => { setConfig({ ...config, colors: { ...config.colors, [key]: e.target.value } }); trackChange() }} className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer shrink-0 shadow-sm" />
                          <div className="flex-1"><p className="text-xs font-medium text-gray-700">{label}</p><p className="text-[10px] text-gray-400 font-mono">{config.colors?.[key] || '#8B2635'}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Typography</p>
                    <div className="space-y-3">
                      <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Heading font</label><select className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={config.typography?.headingFont || 'Inter'} onChange={(e) => { setConfig({ ...config, typography: { ...config.typography, headingFont: e.target.value } }); trackChange() }}><option>Inter</option><option>Playfair Display</option><option>Roboto</option><option>Lora</option><option>Poppins</option></select></div>
                      <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Body font</label><select className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={config.typography?.bodyFont || 'Inter'} onChange={(e) => { setConfig({ ...config, typography: { ...config.typography, bodyFont: e.target.value } }); trackChange() }}><option>Inter</option><option>Roboto</option><option>Lora</option><option>Poppins</option></select></div>
                      <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Base size: <span className="text-primary font-semibold">{config.typography?.baseSize || 16}px</span></label><input type="range" min="12" max="20" value={config.typography?.baseSize || 16} onChange={(e) => { setConfig({ ...config, typography: { ...config.typography, baseSize: parseInt(e.target.value) } }); trackChange() }} className="w-full accent-primary" /></div>
                      <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Border radius: <span className="text-primary font-semibold">{config.typography?.borderRadius || 8}px</span></label><input type="range" min="0" max="24" value={config.typography?.borderRadius || 8} onChange={(e) => { setConfig({ ...config, typography: { ...config.typography, borderRadius: parseInt(e.target.value) } }); trackChange() }} className="w-full accent-primary" /></div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'seo' && (
                <div className="space-y-4">
                  <Input label="Page title" value={config.seo?.title || ''} onChange={(e) => { setConfig({ ...config, seo: { ...config.seo, title: e.target.value } }); trackChange() }} hint={`${(config.seo?.title || '').length}/60 characters`} />
                  <Textarea label="Meta description" value={config.seo?.description || ''} onChange={(e) => { setConfig({ ...config, seo: { ...config.seo, description: e.target.value } }); trackChange() }} rows={3} hint={`${(config.seo?.description || '').length}/160 characters`} />
                  <Input label="Keywords" value={config.seo?.keywords || ''} onChange={(e) => { setConfig({ ...config, seo: { ...config.seo, keywords: e.target.value } }); trackChange() }} placeholder="business, services, philippines" />
                  <Input label="OG image URL" value={config.seo?.ogImage || ''} onChange={(e) => { setConfig({ ...config, seo: { ...config.seo, ogImage: e.target.value } }); trackChange() }} placeholder="https://..." />
                </div>
              )}

              {tab === 'code' && (
                <div className="space-y-4">
                  <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Custom CSS</label><textarea className="w-full text-xs font-mono px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={customCSS} onChange={(e) => { setCustomCSS(e.target.value); trackChange() }} placeholder=".hero { padding: 4rem 0; }" /></div>
                  <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Custom HTML</label><textarea className="w-full text-xs font-mono px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" value={customHTML} onChange={(e) => { setCustomHTML(e.target.value); trackChange() }} placeholder="<script>...</script>" /></div>
                  <Input label="Google Analytics" value={config.integrations?.ga4Id || ''} onChange={(e) => { setConfig({ ...config, integrations: { ...config.integrations, ga4Id: e.target.value } }); trackChange() }} placeholder="G-XXXXXXXXXX" />
                  <Input label="Facebook Pixel" value={config.integrations?.facebookPixel || ''} onChange={(e) => { setConfig({ ...config, integrations: { ...config.integrations, facebookPixel: e.target.value } }); trackChange() }} />
                </div>
              )}

              {tab === 'settings' && (
                <div className="space-y-4">
                  <Input label="Business name" value={config.businessName || ''} onChange={(e) => { setConfig({ ...config, businessName: e.target.value }); trackChange() }} />
                  <Textarea label="Description" value={config.description || ''} onChange={(e) => { setConfig({ ...config, description: e.target.value }); trackChange() }} rows={3} />
                  <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Vibe</label><select className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={config.vibe || site.vibe} onChange={(e) => { setConfig({ ...config, vibe: e.target.value }); trackChange() }}><option value="warm">Warm</option><option value="modern">Modern</option><option value="bold">Bold</option><option value="minimal">Minimal</option></select></div>
                  <div><label className="text-xs text-gray-600 mb-1.5 block font-medium">Template</label><select className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={config.template || site.template} onChange={(e) => { setConfig({ ...config, template: e.target.value }); trackChange() }}><option value="business">Business</option><option value="portfolio">Portfolio</option><option value="ecommerce">E-commerce</option></select></div>
                  <Input label="Domain" value={config.domain || `${site.slug}.vallixis.io`} onChange={(e) => { setConfig({ ...config, domain: e.target.value }); trackChange() }} />
                  <div className="pt-4 border-t border-gray-200"><p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest mb-2">Danger zone</p><Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)} className="text-xs">Delete this site</Button></div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 bg-gray-100 flex flex-col min-w-0">
            <div className="h-11 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                {[{ key: 'desktop' as const, icon: Monitor, label: 'Desktop' }, { key: 'tablet' as const, icon: Tablet, label: 'Tablet' }, { key: 'mobile' as const, icon: Smartphone, label: 'Mobile' }].map(({ key, icon: Icon, label }) => (
                  <button key={key} onClick={() => setDevice(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${device === key ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`} title={label}><Icon size={13} /><span className="hidden sm:inline">{label}</span></button>
                ))}
              </div>
              <button onClick={() => setShowPreview(!showPreview)} className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1.5 font-medium">{showPreview ? <EyeOff size={12} /> : <Eye size={12} />} {showPreview ? 'Hide' : 'Show'}</button>
            </div>

            {showPreview && (
              <div className="flex-1 flex items-start justify-center overflow-auto p-6">
                <div className="bg-white shadow-2xl overflow-auto transition-all duration-500 rounded-2xl border border-gray-200" style={{ width: deviceWidth, maxWidth: '100%', height: 'calc(100vh - 140px)' }}>
                  {/* Browser chrome */}
                  <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2.5 border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400/80" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" /><div className="w-2.5 h-2.5 rounded-full bg-green-400/80" /></div>
                    <div className="flex-1 bg-white rounded-lg px-3 py-1 text-[10px] text-gray-400 text-center border border-gray-200 font-mono">{config.domain || `${site.slug}.vallixis.io`}</div>
                  </div>
                  {/* Site content */}
                  <style>{customCSS}</style>
                  <div style={{ background: config.colors?.background || '#FFFFFF', fontFamily: config.typography?.bodyFont || 'Inter', fontSize: `${config.typography?.baseSize || 16}px` }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <span className="text-sm font-bold" style={{ color: config.colors?.text || '#111827', fontFamily: config.typography?.headingFont || 'Inter' }}>{config.businessName || site.name}</span>
                      <div className="flex gap-4 text-[11px] text-gray-400 font-medium">{sections.filter(s => s.type !== 'hero').map(s => <span key={s.id}>{s.title}</span>)}</div>
                    </div>
                    {renderPreview()}
                    <div className="px-6 py-4 border-t border-gray-100 text-center text-[10px] text-gray-400">© 2026 {config.businessName || site.name}</div>
                  </div>
                  {customHTML && <div dangerouslySetInnerHTML={{ __html: customHTML }} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteConfirm('') }} title="Delete site" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Delete <strong>{site.name}</strong> permanently?</p>
          <Input label={`Type "${site.name}"`} value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={site.name} />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleteConfirm !== site.name}>Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
