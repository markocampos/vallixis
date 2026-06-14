import { Link } from 'react-router-dom'
import { Globe, ExternalLink, Settings } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { Site } from '../types'

interface SiteRowProps {
  site: Site
}

export default function SiteRow({ site }: SiteRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-light rounded flex items-center justify-center shrink-0">
            <Globe size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{site.name}</p>
            <p className="text-xs text-gray-500">{site.slug}.vallixis.io</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={site.status} />
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {site.template.charAt(0).toUpperCase() + site.template.slice(1)}
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {site.last_deployed_at ? new Date(site.last_deployed_at).toLocaleDateString() : '-'}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/sites/${site.id}/edit`} className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors">
            <Settings size={15} />
          </Link>
          {site.domain && (
            <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors">
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </td>
    </tr>
  )
}
