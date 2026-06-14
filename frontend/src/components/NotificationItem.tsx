import { Bell } from 'lucide-react'

interface NotificationItemProps {
  title: string
  body: string
  time: string
  read?: boolean
}

export default function NotificationItem({ title, body, time, read = false }: NotificationItemProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${read ? '' : 'bg-primary-light'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${read ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white'}`}>
        <Bell size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{body}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      {!read && <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />}
    </div>
  )
}
