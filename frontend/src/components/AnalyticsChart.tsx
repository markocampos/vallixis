
interface AnalyticsChartProps {
  data?: Array<{ date: string; views: number; unique_visitors: number }>
  height?: number
}

export default function AnalyticsChart({ data = [], height = 200 }: AnalyticsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm" style={{ height }}>
        No data available yet
      </div>
    )
  }

  const maxViews = Math.max(...data.map((d) => d.views), 1)

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full flex flex-col items-center gap-0.5">
            <div
              className="w-full bg-primary rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ height: `${(d.views / maxViews) * (height - 40)}px` }}
              title={`${d.views} views`}
            />
          </div>
          {data.length <= 10 && (
            <span className="text-xs text-gray-400 rotate-45 origin-left">{d.date.slice(5)}</span>
          )}
        </div>
      ))}
    </div>
  )
}
