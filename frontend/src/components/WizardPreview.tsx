import { useWizardStore } from '../stores/wizardStore'

export default function WizardPreview() {
  const { businessName, description, vibe, template } = useWizardStore()

  return (
    <div className="card overflow-hidden">
      {/* Simulated browser chrome */}
      <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-danger opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-success opacity-60" />
        </div>
        <div className="flex-1 bg-white rounded px-2 py-0.5 text-xs text-gray-400 text-center">
          {businessName ? businessName.toLowerCase().replace(/\s+/g, '-') : 'yoursite'}.vallixis.io
        </div>
      </div>

      {/* Preview content */}
      <div className={`p-6 min-h-48 ${vibe === 'warm' ? 'bg-amber-50' : vibe === 'bold' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`w-12 h-12 rounded-lg mb-4 ${vibe === 'bold' ? 'bg-primary' : 'bg-primary-light'} flex items-center justify-center`}>
          <span className="text-xl font-bold text-primary">{businessName ? businessName[0] : 'V'}</span>
        </div>
        <h3 className={`font-bold text-lg mb-2 ${vibe === 'bold' ? 'text-white' : 'text-gray-900'}`}>
          {businessName || 'Your Business Name'}
        </h3>
        <p className={`text-sm leading-relaxed ${vibe === 'bold' ? 'text-gray-400' : 'text-gray-500'}`}>
          {description || 'Your business description will appear here.'}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-md">
          Get in touch
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          Template: <span className="capitalize text-gray-600 font-medium">{template || '-'}</span>
          {' · '}
          Vibe: <span className="capitalize text-gray-600 font-medium">{vibe || '-'}</span>
        </p>
      </div>
    </div>
  )
}
