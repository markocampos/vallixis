import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import StatCard from '../../components/StatCard'
import UsageBar from '../../components/UsageBar'
import { Globe, BarChart2, PlusCircle, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PLANS } from '../../lib/constants'

export default function DashboardOverview() {
  const { user } = useAuth()
  const plan = PLANS[(user?.plan as keyof typeof PLANS) || 'free']

  return (
    <>
      <PageMeta title="Dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-md text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Plan: <span className="font-semibold text-primary">{plan.name}</span>
            </p>
          </div>
          <Link to="/dashboard/wizard" className="btn-primary gap-2">
            <PlusCircle size={16} />
            New Site
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Sites" value="0" icon={<Globe size={20} />} />
          <StatCard label="Total views" value="0" icon={<BarChart2 size={20} />} />
          <StatCard label="Storage used" value="0 MB" />
          <StatCard label="Bandwidth" value="0 MB" />
        </div>

        {/* Usage */}
        <div className="card p-5">
          <h3 className="text-heading-sm text-gray-900 mb-4">Plan usage</h3>
          <div className="space-y-4">
            <UsageBar label="Storage" used={0} total={plan.storage} />
            <UsageBar label="Bandwidth" used={0} total={plan.bandwidth * 1024} unit="MB" />
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-5">
          <h3 className="text-heading-sm text-gray-900 mb-4">Quick actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/dashboard/wizard" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center">
                <PlusCircle size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">New site</p>
                <p className="text-xs text-gray-500">Launch in minutes</p>
              </div>
            </Link>
            <Link to="/dashboard/analytics" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center">
                <BarChart2 size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">View site stats</p>
              </div>
            </Link>
            <Link to="/pricing" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light transition-colors">
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Upgrade plan</p>
                <p className="text-xs text-gray-500">Get more features</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
