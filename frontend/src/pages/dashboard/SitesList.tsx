import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import SiteRow from '../../components/SiteRow'
import FilterPill from '../../components/FilterPill'
import { PlusCircle, Globe } from 'lucide-react'
import api from '../../lib/api'
import type { Site } from '../../types'

const FILTERS = ['all', 'live', 'building', 'pending', 'error', 'suspended']

export default function SitesList() {
  const [filter, setFilter] = useState('all')
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSites()
  }, [filter])

  const fetchSites = async () => {
    setLoading(true)
    setError('')
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const res = await api.get<{ data: Site[] }>('/sites', { params })
      setSites(res.data.data || [])
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Failed to load sites')
    } finally {
      setLoading(false)
    }
  }

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

        {error && (
          <div className="bg-red-50 border border-danger/20 text-danger text-sm px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Loading sites...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && sites.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe size={24} className="text-primary" />
            </div>
            <h3 className="text-heading-sm text-gray-900 mb-2">No sites yet</h3>
            <p className="text-sm text-gray-500 mb-5">Create your first site in just a few minutes.</p>
            <Link to="/dashboard/wizard" className="btn-primary">Create your first site</Link>
          </div>
        )}

        {/* Table */}
        {!loading && sites.length > 0 && (
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
