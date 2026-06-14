import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import InvoiceRow from '../../components/InvoiceRow'
import { useAuth } from '../../context/AuthContext'
import { PLANS } from '../../lib/constants'
import { CreditCard } from 'lucide-react'

export default function Billing() {
  const { user } = useAuth()
  const plan = PLANS[(user?.plan as keyof typeof PLANS) || 'free']
  const invoices: any[] = [] // TODO: Phase 1 — fetch from API

  return (
    <>
      <PageMeta title="Billing" />
      <div className="space-y-6">
        <h1 className="text-heading-md text-gray-900">Billing</h1>

        {/* Current plan */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-heading-sm text-gray-900 mb-1">Current plan: {plan.name}</h3>
              <p className="text-sm text-gray-500">
                {plan.price === 0 ? 'Free forever' : `${plan.displayPrice}/month via PayMongo`}
              </p>
            </div>
            {plan.price === 0 && (
              <Link to="/pricing" className="btn-primary btn-sm">Upgrade plan</Link>
            )}
          </div>
        </div>

        {/* Payment method */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-heading-sm text-gray-900">Payment method</h3>
            <button className="btn-outline btn-sm">Add card</button>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <CreditCard size={18} />
            No payment method on file
          </div>
        </div>

        {/* Invoices */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-heading-sm text-gray-900">Invoice history</h3>
          </div>
          {invoices.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No invoices yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => <InvoiceRow key={inv.id} invoice={inv} />)}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
