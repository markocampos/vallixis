import { formatPHP } from '../lib/constants'
import type { Invoice } from '../types'

interface InvoiceRowProps {
  invoice: Invoice
}

const statusClass: Record<string, string> = {
  paid: 'badge-live',
  pending: 'badge-pending',
  failed: 'badge-error',
  refunded: 'badge-gray',
  cancelled: 'badge-gray'
}

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-sm text-gray-900">
        {new Date(invoice.created_at).toLocaleDateString('en-PH', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-3 px-4 text-sm text-gray-700">{invoice.description || '-'}</td>
      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{formatPHP(invoice.amount)}</td>
      <td className="py-3 px-4">
        <span className={statusClass[invoice.status] || 'badge-gray'}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </td>
      <td className="py-3 px-4">
        {invoice.receipt_url ? (
          <a href={invoice.receipt_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium">
            View
          </a>
        ) : '-'}
      </td>
    </tr>
  )
}
