import PageMeta from '../components/PageMeta'
import { MessageSquare } from 'lucide-react'

export default function Forum() {
  return (
    <>
      <PageMeta title="Community Forum" description="Join the Vallixis community. Ask questions, share tips, and connect with other entrepreneurs." />
      <section className="section-padding">
        <div className="container-page max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={28} className="text-primary" />
          </div>
          <h1 className="text-heading-lg text-gray-900 mb-4">Community Forum</h1>
          <p className="text-body-md text-gray-500 mb-8">
            Our community forum is coming soon! In the meantime, reach out to us directly via the support page.
          </p>
          <p className="text-sm text-gray-400">We'll notify you when the forum launches.</p>
        </div>
      </section>
    </>
  )
}
