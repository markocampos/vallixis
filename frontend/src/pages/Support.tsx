import React, { useState } from 'react'
import PageMeta from '../components/PageMeta'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Button from '../components/Button'
import { MessageSquare } from 'lucide-react'

const faqs = [
  { q: 'How long does it take to launch my site?', a: 'Usually under 2 minutes after completing the wizard.' },
  { q: 'Can I use my own domain?', a: 'Yes! On paid plans you can connect a custom domain. We also provide a free .vallixis.io subdomain.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major cards, GCash, and Maya via PayMongo. Prices are in Philippine Peso.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your billing settings. No questions asked. Your site stays live until the end of the billing period.' },
  { q: 'What happens to my site on the free plan?', a: 'Your free site stays live with Vallixis branding. Upgrade to remove branding and get more storage.' }
]

export default function Support() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit to API in Phase 1
    setSent(true)
  }

  return (
    <>
      <PageMeta
        title="Support"
        description="Get help with your Vallixis site. Read our FAQs or send us a message."
        ogImage="/og-support.jpg"
      />

      <section className="section-padding">
        <div className="container-page max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-heading-lg text-gray-900 mb-4">How can we help?</h1>
            <p className="text-body-md text-gray-500">We usually respond within a few hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* FAQ */}
            <div>
              <h2 className="text-heading-md text-gray-900 mb-6">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="card p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-500">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-heading-md text-gray-900 mb-6">Send us a message</h2>
              {sent ? (
                <div className="card p-8 text-center">
                  <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={20} className="text-primary" />
                  </div>
                  <h3 className="text-heading-sm text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-sm text-gray-500">We'll get back to you within a few hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Subject"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                  <Textarea
                    label="Message"
                    placeholder="Describe your issue or question..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    required
                  />
                  <Button type="submit" fullWidth>Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
