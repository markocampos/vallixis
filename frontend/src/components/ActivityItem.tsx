
interface ActivityItemProps {
  action: string
  detail?: string
  time: string
  icon?: React.ReactNode
}

export default function ActivityItem({ action, detail, time, icon }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {icon && (
        <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center shrink-0 text-primary">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        {detail && <p className="text-xs text-gray-500 truncate">{detail}</p>}
      </div>
      <span className="text-xs text-gray-400 shrink-0">{time}</span>
    </div>
  )
}
