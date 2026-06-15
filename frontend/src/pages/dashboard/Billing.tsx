import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import InvoiceRow from '../../components/InvoiceRow'
import { useAuth } from '../../context/AuthContext'
import { CreditCard, Check } from 'lucide-react'
import api from '../../lib/api'
import type { Invoice } from '../../types'

interface BillingInfo {
  plan: {
    key: string
    name: string
    status: string
  }
  limits: {
    sites: number
    storage_mb: number
    bandwidth_gb: number
    emails: number
  }
  usage: {
    sites: number
    storage_mb: number
    bandwidth_mb: number
  }
}

export default function Billing() {
  const { user } = useAuth()
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [billingRes, invoicesRes] = await Promise.all([
        api.get<{ data: BillingInfo }>('/billing'),
        api.get<{ data: Invoice[] }>('/billing/invoices')
      ])
      setBilling(billingRes.data.data)
      setInvoices(invoicesRes.data.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const plan = billing?.plan
  const isFree = plan?.key === 'free'

  return (
    <>
      <PageMeta title="Billing" />
      <div className="space-y-6">
        <h1 className="text-heading-md text-gray-900">Billing</h1>

        {/* Current plan */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-heading-sm text-gray-900 mb-1">
                Current plan: {loading ? '...' : (plan?.name || 'Free')}
              </h3>
              <p className="text-sm text-gray-500">
                {isFree ? 'Free forever' : `Active subscription via PayMongo`}
              </p>
              {plan?.status && plan.status !== 'active' && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </span>
              )}
            </div>
            {isFree && (
              <Link to="/pricing" className="btn-primary btn-sm">Upgrade plan</Link>
            )}
          </div>
        </div>

        {/* Plan details */}
        {!loading && billing && (
          <div className="card p-5">
            <h3 className="text-heading-sm text-gray-900 mb-4">Plan details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{billing.usage.sites}</p>
                <p className="text-xs text-gray-500 mt-1">Sites ({billing.limits.sites} max)</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{billing.usage.storage_mb}</p>
                <p className="text-xs text-gray-500 mt-1">MB Storage ({billing.limits.storage_mb} max)</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{billing.usage.bandwidth_mb}</p>
                <p className="text-xs text-gray-500 mt-1">MB Bandwidth ({billing.limits.bandwidth_gb * 1024} max)</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{billing.limits.emails === -1 ? '∞' : billing.limits.emails}</p>
                <p className="text-xs text-gray-500 mt-1">Email aliases</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment method */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-heading-sm text-gray-900">Payment method</h3>
            {!isFree && <button className="btn-outline btn-sm">Update</button>}
          </div>
          {isFree ? (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <CreditCard size={18} />
              No payment method — you're on the Free plan
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <CreditCard size={18} className="text-primary" />
              <div>
                <p className="font-medium">PayMongo subscription</p>
                <p className="text-xs text-gray-500">Managed automatically</p>
              </div>
              <Check size={16} className="text-success ml-auto" />
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-heading-sm text-gray-900">Invoice history</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              {isFree ? 'No invoices — you\'re on the Free plan' : 'No invoices yet'}
            </div>
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
