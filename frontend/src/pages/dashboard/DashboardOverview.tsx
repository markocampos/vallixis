import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import StatCard from '../../components/StatCard'
import UsageBar from '../../components/UsageBar'
import { Globe, BarChart2, PlusCircle, Zap, CreditCard, Image, LifeBuoy } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

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

export default function DashboardOverview() {
  const { user } = useAuth()
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBilling()
  }, [])

  const fetchBilling = async () => {
    try {
      const res = await api.get<{ data: BillingInfo }>('/billing')
      setBilling(res.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const plan = billing?.plan
  const limits = billing?.limits
  const usage = billing?.usage

  return (
    <>
      <PageMeta title="Dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-md text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Plan: <span className="font-semibold text-primary">{loading ? '...' : (plan?.name || 'Free')}</span>
            </p>
          </div>
          <Link to="/dashboard/wizard" className="btn-primary gap-2">
            <PlusCircle size={16} />
            New Site
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Sites"
            value={loading ? '-' : String(usage?.sites ?? 0)}
            icon={<Globe size={20} />}
            sub={limits ? `${limits.sites} max on ${plan?.name || 'Free'} plan` : undefined}
          />
          <StatCard
            label="Total views"
            value={loading ? '-' : '0'}
            icon={<BarChart2 size={20} />}
          />
          <StatCard
            label="Storage used"
            value={loading ? '-' : `${usage?.storage_mb ?? 0} MB`}
          />
          <StatCard
            label="Bandwidth"
            value={loading ? '-' : `${usage?.bandwidth_mb ?? 0} MB`}
          />
        </div>

        {/* Usage */}
        <div className="card p-5">
          <h3 className="text-heading-sm text-gray-900 mb-4">Plan usage</h3>
          <div className="space-y-4">
            <UsageBar
              label="Storage"
              used={usage?.storage_mb ?? 0}
              total={limits?.storage_mb ?? 50}
              unit="MB"
            />
            <UsageBar
              label="Bandwidth"
              used={usage?.bandwidth_mb ?? 0}
              total={(limits?.bandwidth_gb ?? 1) * 1024}
              unit="MB"
            />
            <UsageBar
              label="Sites"
              used={usage?.sites ?? 0}
              total={limits?.sites ?? 1}
              unit="sites"
            />
          </div>
          {plan?.key === 'free' && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/pricing" className="text-sm text-primary hover:text-primary-hover font-medium">
                Upgrade your plan →
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card p-5">
          <h3 className="text-heading-sm text-gray-900 mb-4">Quick actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/dashboard/wizard" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                <PlusCircle size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">New site</p>
                <p className="text-xs text-gray-500">Launch in minutes</p>
              </div>
            </Link>
            <Link to="/dashboard/analytics" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                <BarChart2 size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">View site stats</p>
              </div>
            </Link>
            <Link to="/dashboard/billing" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Billing</p>
                <p className="text-xs text-gray-500">Manage subscription</p>
              </div>
            </Link>
            <Link to="/dashboard/assets" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                <Image size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Assets</p>
                <p className="text-xs text-gray-500">Manage images</p>
              </div>
            </Link>
            <Link to="/dashboard/support" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                <LifeBuoy size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Support</p>
                <p className="text-xs text-gray-500">Get help</p>
              </div>
            </Link>
            <Link to="/pricing" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                <Zap size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">Upgrade</p>
                <p className="text-xs text-gray-500">Get more features</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
