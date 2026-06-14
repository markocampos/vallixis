import { SITE_STATUS_LABELS } from '../lib/constants'

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classes: Record<string, string> = {
    live: 'badge-live',
    pending: 'badge-pending',
    building: 'badge-pending',
    suspended: 'badge-gray',
    error: 'badge-error'
  }

  const dotColors: Record<string, string> = {
    live: 'bg-success',
    pending: 'bg-warning',
    building: 'bg-warning',
    suspended: 'bg-gray-400',
    error: 'bg-danger'
  }

  return (
    <span className={classes[status] || 'badge-gray'}>
      <span className={`status-dot ${dotColors[status] || 'bg-gray-400'}`} />
      {SITE_STATUS_LABELS[status] || status}
    </span>
  )
}
