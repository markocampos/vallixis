import { useWizardStore } from '../stores/wizardStore'

const vibeStyles: Record<string, { bg: string; text: string; accent: string; muted: string }> = {
  warm: { bg: 'bg-amber-50', text: 'text-gray-900', accent: 'bg-primary', muted: 'text-gray-600' },
  modern: { bg: 'bg-white', text: 'text-gray-900', accent: 'bg-primary', muted: 'text-gray-500' },
  bold: { bg: 'bg-gray-900', text: 'text-white', accent: 'bg-primary', muted: 'text-gray-400' },
  minimal: { bg: 'bg-gray-50', text: 'text-gray-900', accent: 'bg-primary', muted: 'text-gray-500' },
}

export default function WizardPreview() {
  const { businessName, description, vibe, template, domainSlug } = useWizardStore()
  const styles = vibeStyles[vibe] || vibeStyles.modern
  const slug = domainSlug || (businessName ? businessName.toLowerCase().replace(/\s+/g, '-') : 'yoursite')

  return (
    <div className="card overflow-hidden shadow-lg animate-preview">
      {/* Browser chrome */}
      <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-danger opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-success opacity-60" />
        </div>
        <div className="flex-1 bg-white rounded px-2 py-0.5 text-xs text-gray-400 text-center truncate">
          {slug}.vallixis.io
        </div>
      </div>

      {/* Preview content */}
      <div className={`${styles.bg} ${styles.text} p-6 min-h-[280px] transition-colors duration-300`}>
        {/* Nav bar mock */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-current/10">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 ${styles.accent} rounded flex items-center justify-center`}>
              <span className="text-xs font-bold text-white">{businessName ? businessName[0] : 'V'}</span>
            </div>
            <span className="text-sm font-semibold">{businessName || 'Your Business'}</span>
          </div>
          <div className="flex gap-3 text-xs opacity-60">
            <span>About</span>
            <span>Services</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Hero mock */}
        <div className="mb-6">
          <h3 className="font-bold text-xl mb-2 animate-typewriter">
            {businessName ? `Welcome to ${businessName}` : 'Your Headline Here'}
          </h3>
          <p className={`text-sm leading-relaxed ${styles.muted} max-w-sm`}>
            {description || 'Your business description will appear here.'}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm">
            Get Started
          </div>
        </div>

        {/* Content blocks mock */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-current/5 rounded-lg p-3 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-8 h-8 ${styles.accent} rounded-md mb-2 opacity-80`} />
              <div className="h-2 bg-current/10 rounded w-3/4 mb-1" />
              <div className="h-1.5 bg-current/5 rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Footer mock */}
        <div className="pt-3 border-t border-current/10 flex items-center justify-between text-xs opacity-40">
          <span>© 2026 {businessName || 'Your Business'}</span>
          <span className="flex items-center gap-1">
            Made with <span className="font-semibold">Vallixis</span>
          </span>
        </div>
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          <span className="capitalize font-medium text-gray-600">{template || 'business'}</span>
          {' · '}
          <span className="capitalize font-medium text-gray-600">{vibe || 'modern'}</span>
        </p>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live preview</span>
        </div>
      </div>
    </div>
  )
}
