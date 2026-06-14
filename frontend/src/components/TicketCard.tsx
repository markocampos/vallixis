import { MessageSquare, Clock } from 'lucide-react'

interface TicketCardProps {
  subject: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
}

const statusClass: Record<string, string> = {
  open: 'badge-pending',
  in_progress: 'badge-pending',
  waiting_on_you: 'badge-live',
  resolved: 'badge-gray',
  closed: 'badge-gray'
}

export default function TicketCard({ subject, status, priority, createdAt, updatedAt }: TicketCardProps) {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare size={16} className="text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{subject}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={statusClass[status] || 'badge-gray'}>
                {status.replace(/_/g, ' ')}
              </span>
              {priority === 'high' && (
                <span className="badge badge-error">High</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Clock size={12} />
        <span>Updated {new Date(updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
