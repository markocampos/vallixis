import { useState, useEffect } from 'react'
import PageMeta from '../../components/PageMeta'
import TicketCard from '../../components/TicketCard'
import Modal from '../../components/Modal'
import Textarea from '../../components/Textarea'
import Button from '../../components/Button'
import { PlusCircle, LifeBuoy, MessageSquare, Clock, CheckCircle, X } from 'lucide-react'
import api from '../../lib/api'

interface Ticket {
  id: string
  subject: string
  message: string
  status: string
  priority: string
  site_id: string | null
  site_name: string | null
  created_at: string
  updated_at: string
}

interface Site {
  id: string
  name: string
  slug: string
}

const SUBJECTS = [
  'Technical issue',
  'Billing question',
  'Feature request',
  'Domain setup help',
  'Account issue',
  'Other'
]

const statusConfig: Record<string, { class: string; label: string; icon: React.ReactNode }> = {
  open: { class: 'bg-amber-50 text-amber-700', label: 'Open', icon: <Clock size={14} /> },
  in_progress: { class: 'bg-blue-50 text-blue-700', label: 'In progress', icon: <MessageSquare size={14} /> },
  waiting_on_you: { class: 'bg-primary-light text-primary', label: 'Waiting on you', icon: <MessageSquare size={14} /> },
  resolved: { class: 'bg-green-50 text-success', label: 'Resolved', icon: <CheckCircle size={14} /> },
  closed: { class: 'bg-gray-100 text-gray-500', label: 'Closed', icon: <X size={14} /> }
}

export default function DashboardSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ subject: '', message: '', siteId: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ticketsRes, sitesRes] = await Promise.all([
        api.get<{ data: Ticket[] }>('/support'),
        api.get<{ data: Site[] }>('/sites')
      ])
      setTickets(ticketsRes.data.data || [])
      setSites(sitesRes.data.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject || !form.message) {
      setError('Subject and message are required')
      return
    }
    if (form.message.length < 20) {
      setError('Message must be at least 20 characters')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await api.post('/support', {
        subject: form.subject,
        message: form.message,
        siteId: form.siteId || null
      })
      setSuccess('Ticket submitted! We\'ll get back to you within 24 hours.')
      setShowForm(false)
      setForm({ subject: '', message: '', siteId: '' })
      fetchData()
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Failed to submit ticket')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseTicket = async (ticketId: string) => {
    try {
      await api.post(`/support/${ticketId}/close`)
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t))
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: 'closed' })
      }
    } catch {
      // ignore
    }
  }

  return (
    <>
      <PageMeta title="Support" />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-md text-gray-900">Support</h1>
          <Button size="sm" icon={<PlusCircle size={16} />} onClick={() => setShowForm(!showForm)}>
            New ticket
          </Button>
        </div>

        {success && (
          <div className="bg-green-50 border border-success/20 text-success text-sm px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-sm text-gray-900">Open a support ticket</h3>
              <button type="button" onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-danger/20 text-danger text-sm px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="label">Subject *</label>
              <select
                className="input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              >
                <option value="">Select a topic...</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {sites.length > 0 && (
              <div>
                <label className="label">Related site (optional)</label>
                <select
                  className="input"
                  value={form.siteId}
                  onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                >
                  <option value="">None</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.slug}.vallixis.io)</option>
                  ))}
                </select>
              </div>
            )}

            <Textarea
              label="Message *"
              placeholder="Please describe your issue in detail. Include steps to reproduce if applicable..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              required
            />
            <p className="text-xs text-gray-400">{form.message.length}/5000 (min 20 characters)</p>

            <div className="flex gap-3">
              <Button variant="ghost" size="sm" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" loading={submitting}>Submit ticket</Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="card p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LifeBuoy size={24} className="text-primary" />
            </div>
            <h3 className="text-heading-sm text-gray-900 mb-2">No support tickets</h3>
            <p className="text-sm text-gray-500 mb-5">Need help? Open a ticket and we'll get back to you within 24 hours.</p>
            <Button size="sm" icon={<PlusCircle size={16} />} onClick={() => setShowForm(true)}>
              Create your first ticket
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <TicketCard
                key={t.id}
                subject={t.subject}
                message={t.message}
                status={t.status}
                priority={t.priority}
                createdAt={t.created_at}
                updatedAt={t.updated_at}
                siteName={t.site_name}
                onClick={() => setSelectedTicket(t)}
                onClose={t.status !== 'closed' && t.status !== 'resolved' ? () => handleCloseTicket(t.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ticket detail modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.subject || ''}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-4">
            {/* Status & meta */}
            <div className="flex items-center gap-3 flex-wrap">
              {(() => {
                const info = statusConfig[selectedTicket.status] || statusConfig.open
                return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${info.class}`}>
                    {info.icon}
                    {info.label}
                  </span>
                )
              })()}
              {selectedTicket.priority === 'high' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-danger">
                  High priority
                </span>
              )}
              {selectedTicket.site_name && (
                <span className="text-xs text-gray-500">Site: {selectedTicket.site_name}</span>
              )}
            </div>

            {/* Message */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.message}</p>
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Created {new Date(selectedTicket.created_at).toLocaleString('en-PH')}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Updated {new Date(selectedTicket.updated_at).toLocaleString('en-PH')}
              </span>
            </div>

            {/* Actions */}
            {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
                  Close dialog
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleCloseTicket(selectedTicket.id)}>
                  Close ticket
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
