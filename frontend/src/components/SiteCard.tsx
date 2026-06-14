import { Link } from 'react-router-dom'
import { Globe, ExternalLink } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { Site } from '../types'

interface SiteCardProps {
  site: Site
}

export default function SiteCard({ site }: SiteCardProps) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
            <Globe size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{site.name}</h3>
            <p className="text-xs text-gray-500">{site.slug}.vallixis.io</p>
          </div>
        </div>
        <StatusBadge status={site.status} />
      </div>

      <div className="flex items-center justify-between mt-4">
        <Link to={`/dashboard/sites/${site.id}/edit`} className="btn-outline btn-sm">
          Edit
        </Link>
        {site.domain && (
          <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  )
}
