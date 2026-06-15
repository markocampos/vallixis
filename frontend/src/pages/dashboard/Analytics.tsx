import { useState, useEffect } from 'react'
import PageMeta from '../../components/PageMeta'
import AnalyticsChart from '../../components/AnalyticsChart'
import StatCard from '../../components/StatCard'
import { BarChart2, Eye, Users, Globe } from 'lucide-react'
import api from '../../lib/api'

interface AnalyticsData {
  summary: {
    totalViews: number
    totalUniqueVisitors: number
    sitesTracked: number
  }
  chart: Array<{ date: string; views: number; unique_visitors: number }>
  sources: Record<string, number>
  topPages: Array<{ path: string; views: number }>
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get<{ data: AnalyticsData }>('/analytics', { params: { days } })
      setData(res.data.data)
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const summary = data?.summary

  return (
    <>
      <PageMeta title="Analytics" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-md text-gray-900">Analytics</h1>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="input w-auto"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-danger/20 text-danger text-sm px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total views"
            value={loading ? '-' : (summary?.totalViews ?? 0).toLocaleString()}
            icon={<Eye size={20} />}
          />
          <StatCard
            label="Unique visitors"
            value={loading ? '-' : (summary?.totalUniqueVisitors ?? 0).toLocaleString()}
            icon={<Users size={20} />}
          />
          <StatCard
            label="Sites tracked"
            value={loading ? '-' : String(summary?.sitesTracked ?? 0)}
            icon={<Globe size={20} />}
          />
          <StatCard
            label="Avg views/site"
            value={loading ? '-' : String(
              summary?.sitesTracked
                ? Math.round((summary?.totalViews ?? 0) / summary.sitesTracked).toLocaleString()
                : 0
            )}
            icon={<BarChart2 size={20} />}
          />
        </div>

        {/* Chart */}
        <div className="card p-5">
          <h3 className="text-heading-sm text-gray-900 mb-4">Page views</h3>
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnalyticsChart data={data?.chart || []} height={200} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top pages */}
          <div className="card p-5">
            <h3 className="text-heading-sm text-gray-900 mb-4">Top pages</h3>
            {loading ? (
              <div className="flex items-center justify-center h-[120px]">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : data?.topPages && data.topPages.length > 0 ? (
              <div className="space-y-2">
                {data.topPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700 font-mono">{page.path}</span>
                    <span className="text-sm font-semibold text-gray-900">{page.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No page data yet</p>
            )}
          </div>

          {/* Traffic sources */}
          <div className="card p-5">
            <h3 className="text-heading-sm text-gray-900 mb-4">Traffic sources</h3>
            {loading ? (
              <div className="flex items-center justify-center h-[120px]">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : data?.sources && Object.keys(data.sources).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.sources)
                  .sort(([, a], [, b]) => b - a)
                  .map(([source, count]) => {
                    const total = Object.values(data.sources).reduce((s, v) => s + v, 0)
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0
                    return (
                      <div key={source}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 capitalize">{source}</span>
                          <span className="text-sm text-gray-500">{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No source data yet</p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center">
          We don't store IP addresses or personal data. All visitor data is anonymized.
        </p>
      </div>
    </>
  )
}
