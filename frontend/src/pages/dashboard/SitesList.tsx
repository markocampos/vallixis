import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import SiteRow from '../../components/SiteRow'
import FilterPill from '../../components/FilterPill'
import { PlusCircle, Globe } from 'lucide-react'

const FILTERS = ['all', 'live', 'building', 'pending', 'error', 'suspended']

export default function SitesList() {
  const [filter, setFilter] = useState('all')
  // TODO: Phase 1 — fetch sites from API with react-query
  const sites: any[] = []

  return (
    <>
      <PageMeta title="My Sites" />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-md text-gray-900">My Sites</h1>
          <Link to="/dashboard/wizard" className="btn-primary gap-2">
            <PlusCircle size={16} />
            New Site
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <FilterPill key={f} label={f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} active={filter === f} onClick={() => setFilter(f)} />
          ))}
        </div>

        {/* Table */}
        {sites.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe size={24} className="text-primary" />
            </div>
            <h3 className="text-heading-sm text-gray-900 mb-2">No sites yet</h3>
            <p className="text-sm text-gray-500 mb-5">Create your first site in just a few minutes.</p>
            <Link to="/dashboard/wizard" className="btn-primary">Create your first site</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Site</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last deployed</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => <SiteRow key={site.id} site={site} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
