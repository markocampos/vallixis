import PageMeta from '../../components/PageMeta'
import AnalyticsChart from '../../components/AnalyticsChart'
import StatCard from '../../components/StatCard'
import { BarChart2, Eye, Users, Clock } from 'lucide-react'

export default function Analytics() {
  // TODO: Phase 1 — fetch analytics data
  const data: Array<{ date: string; views: number; unique_visitors: number }> = []

  return (
    <>
      <PageMeta title="Analytics" />
      <div className="space-y-6">
        <h1 className="text-heading-md text-gray-900">Analytics</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total views" value="-" icon={<Eye size={20} />} />
          <StatCard label="Unique visitors" value="-" icon={<Users size={20} />} />
          <StatCard label="Avg. time on site" value="-" icon={<Clock size={20} />} />
          <StatCard label="Sites tracked" value="0" icon={<BarChart2 size={20} />} />
        </div>

        <div className="card p-5">
          <h3 className="text-heading-sm text-gray-900 mb-4">Page views (last 30 days)</h3>
          <AnalyticsChart data={data} height={200} />
        </div>

        <p className="text-sm text-gray-400 text-center">Analytics data will appear once your site receives visitors.</p>
      </div>
    </>
  )
}
