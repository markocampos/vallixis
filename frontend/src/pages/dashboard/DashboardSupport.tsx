import React, { useState } from 'react'
import PageMeta from '../../components/PageMeta'
import TicketCard from '../../components/TicketCard'
import Textarea from '../../components/Textarea'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { PlusCircle, LifeBuoy } from 'lucide-react'

export default function DashboardSupport() {
  const tickets: any[] = [] // TODO: Phase 1 — fetch from API
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: '', message: '' })

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

        {showForm && (
          <div className="card p-5 space-y-4">
            <h3 className="text-heading-sm text-gray-900">Open a support ticket</h3>
            <Input
              label="Subject"
              placeholder="Brief description of your issue"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
            <Textarea
              label="Message"
              placeholder="Please describe your issue in detail..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              required
            />
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm">Submit ticket</Button>
            </div>
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LifeBuoy size={24} className="text-primary" />
            </div>
            <h3 className="text-heading-sm text-gray-900 mb-2">No support tickets</h3>
            <p className="text-sm text-gray-500">Need help? Open a ticket and we'll get back to you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <TicketCard key={t.id} subject={t.subject} status={t.status} priority={t.priority} createdAt={t.created_at} updatedAt={t.updated_at} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
