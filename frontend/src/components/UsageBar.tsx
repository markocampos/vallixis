
interface UsageBarProps {
  label: string
  used: number
  total: number
  unit?: string
  danger?: boolean
}

export default function UsageBar({ label, used, total, unit = 'MB', danger }: UsageBarProps) {
  const pct = Math.min((used / total) * 100, 100)
  const isHigh = pct >= 80

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600 font-medium">{label}</span>
        <span className="text-xs text-gray-500">
          {used.toLocaleString()} / {total.toLocaleString()} {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            danger || isHigh ? 'bg-danger' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isHigh && (
        <p className="text-xs text-danger mt-1">{pct.toFixed(0)}% used. Consider upgrading.</p>
      )}
    </div>
  )
}
