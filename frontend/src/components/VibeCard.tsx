
interface VibeCardProps {
  vibe: string
  description: string
  selected: boolean
  onSelect: () => void
}

const vibeColors: Record<string, string> = {
  warm: 'bg-amber-100 border-amber-300',
  modern: 'bg-slate-100 border-slate-300',
  bold: 'bg-gray-900 border-gray-700',
  minimal: 'bg-white border-gray-200'
}

const vibeTextColors: Record<string, string> = {
  warm: 'text-amber-900',
  modern: 'text-slate-900',
  bold: 'text-white',
  minimal: 'text-gray-900'
}

export default function VibeCard({ vibe, description, selected, onSelect }: VibeCardProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
        selected ? 'border-primary ring-2 ring-primary ring-offset-1' : 'border-gray-200 hover:border-primary'
      }`}
      onClick={onSelect}
    >
      {/* Vibe preview swatch */}
      <div className={`w-full h-16 rounded-md border mb-3 ${vibeColors[vibe] || 'bg-gray-100'} flex items-center justify-center`}>
        <span className={`text-sm font-bold capitalize ${vibeTextColors[vibe] || 'text-gray-900'}`}>{vibe}</span>
      </div>

      <p className="text-sm font-semibold text-gray-900 capitalize">{vibe}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>

      {selected && (
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">
          <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white text-xs">✓</span>
          Selected
        </div>
      )}
    </div>
  )
}
