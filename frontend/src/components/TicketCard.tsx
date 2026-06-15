import { MessageSquare, Clock, X } from 'lucide-react'

interface TicketCardProps {
  subject: string
  message?: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  siteName?: string | null
  onClose?: () => void
  onClick?: () => void
}

const statusConfig: Record<string, { class: string; label: string }> = {
  open: { class: 'bg-amber-50 text-amber-700', label: 'Open' },
  in_progress: { class: 'bg-blue-50 text-blue-700', label: 'In progress' },
  waiting_on_you: { class: 'bg-primary-light text-primary', label: 'Waiting on you' },
  resolved: { class: 'bg-green-50 text-success', label: 'Resolved' },
  closed: { class: 'bg-gray-100 text-gray-500', label: 'Closed' }
}

export default function TicketCard({ subject, message, status, priority, createdAt, updatedAt, siteName, onClose, onClick }: TicketCardProps) {
  const statusInfo = statusConfig[status] || statusConfig.open
  const isActive = status !== 'closed' && status !== 'resolved'

  return (
    <div
      onClick={onClick}
      className={`card p-4 transition-all ${onClick ? 'cursor-pointer' : ''} ${isActive ? 'hover:shadow-md hover:border-gray-300' : 'opacity-60'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-primary-light' : 'bg-gray-100'}`}>
            <MessageSquare size={16} className={isActive ? 'text-primary' : 'text-gray-400'} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">{subject}</h4>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {statusInfo.label}
              </span>
              {priority === 'high' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-danger">
                  High
                </span>
              )}
            </div>
          </div>
        </div>

        {isActive && onClose && (
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Close ticket"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {message && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2 ml-12">{message}</p>
      )}

      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 ml-12">
        <Clock size={12} />
        <span>{new Date(updatedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  )
}
