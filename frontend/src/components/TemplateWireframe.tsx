
interface TemplateWireframeProps {
  template: string
  vibe?: string
}

export default function TemplateWireframe({ template, vibe }: TemplateWireframeProps) {
  const bg = vibe === 'warm' ? 'bg-amber-50' : vibe === 'bold' ? 'bg-gray-900' : 'bg-white'
  const accent = 'bg-primary'
  const gray = vibe === 'bold' ? 'bg-gray-700' : 'bg-gray-200'
  const textGray = vibe === 'bold' ? 'bg-gray-600' : 'bg-gray-100'

  return (
    <div className={`rounded-md overflow-hidden border border-gray-200 ${bg} p-2`} aria-hidden="true">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-2 rounded ${accent}`} />
        <div className="flex gap-1">
          <div className={`w-4 h-1.5 rounded ${gray}`} />
          <div className={`w-4 h-1.5 rounded ${gray}`} />
          <div className={`w-4 h-1.5 rounded ${gray}`} />
        </div>
      </div>

      {/* Hero */}
      <div className={`rounded h-8 mb-2 ${gray} flex items-center justify-center`}>
        <div className={`w-12 h-1.5 rounded ${accent}`} />
      </div>

      {template === 'business' && (
        <div className="grid grid-cols-3 gap-1">
          {[0,1,2].map(i => (
            <div key={i} className={`h-6 rounded ${textGray}`} />
          ))}
        </div>
      )}

      {template === 'portfolio' && (
        <div className="grid grid-cols-2 gap-1">
          {[0,1,2,3].map(i => (
            <div key={i} className={`h-5 rounded ${textGray}`} />
          ))}
        </div>
      )}

      {template === 'ecommerce' && (
        <div className="space-y-1">
          {[0,1].map(i => (
            <div key={i} className="flex gap-1">
              <div className={`w-8 h-5 rounded ${textGray}`} />
              <div className={`flex-1 h-5 rounded ${textGray}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
