import PageMeta from '../components/PageMeta'
import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'

const useCases = [
  'Local sari-sari stores and carinderia',
  'Freelancers and virtual assistants',
  'Event photographers and videographers',
  'Tutors and online instructors',
  'Repair shops and handyman services',
  'Nail salons, barbershops, and wellness clinics'
]

export default function Business() {
  return (
    <>
      <PageMeta
        title="For Businesses"
        description="Vallixis is built for Filipino solo entrepreneurs. Get your business online today."
      />

      <section className="section-padding">
        <div className="container-page max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-heading-lg text-gray-900 mb-4">Built for Filipino small business owners</h1>
            <p className="text-body-lg text-gray-500">
              You don't need a developer. You don't need a big budget. You need to be online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-heading-md text-gray-900 mb-4">Perfect for</h2>
              <ul className="space-y-3">
                {useCases.map((u, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <Check size={16} className="text-primary shrink-0" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 bg-primary text-white">
              <p className="text-lg font-bold mb-2">P250/month</p>
              <p className="text-sm opacity-80 mb-4">That's less than a cup of coffee a day.</p>
              <ul className="space-y-2 mb-6">
                {['Professional website', 'Free domain', 'SSL certificate', 'Mobile ready', 'Hosting included'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="opacity-80 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center bg-white text-primary font-semibold text-sm py-2.5 rounded-md hover:bg-primary-light transition-colors">
                Get started today <ArrowRight size={14} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
