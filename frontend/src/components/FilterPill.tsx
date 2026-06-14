
interface FilterPillProps {
  label: string
  active?: boolean
  onClick: () => void
  count?: number
}

export default function FilterPill({ label, active, onClick, count }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all border ${
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
          active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {count}
        </span>
      )}
    </button>
  )
}
