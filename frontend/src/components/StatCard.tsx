
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatCard({ label, value, sub, icon, trend }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 font-medium ${
          trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-gray-400'
        }`}>
          {sub}
        </p>
      )}
    </div>
  )
}
