import PageMeta from '../components/PageMeta'
import { APP_NAME } from '../lib/constants'

const roadmapItems = [
  { phase: 'Phase 0', status: 'done', title: 'Foundation', items: ['Authentication system', 'Site wizard', 'Static hosting', 'Dashboard UI'] },
  { phase: 'Phase 1', status: 'current', title: 'Core Features', items: ['Site editor', 'Custom domains', 'Analytics', 'PayMongo billing'] },
  { phase: 'Phase 2', status: 'planned', title: 'Growth', items: ['E-commerce checkout', 'Form builder', 'Email notifications', 'SEO tools'] },
  { phase: 'Phase 3', status: 'planned', title: 'Scale', items: ['White-label option', 'Team accounts', 'API access', 'Affiliate program'] }
]

export default function Roadmap() {
  return (
    <>
      <PageMeta title="Roadmap" description={`See what's coming next for ${APP_NAME}.`} />
      <section className="section-padding">
        <div className="container-page max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-heading-lg text-gray-900 mb-4">Product roadmap</h1>
            <p className="text-body-md text-gray-500">We build in public. Here's what we're working on.</p>
          </div>

          <div className="space-y-6">
            {roadmapItems.map((phase, i) => (
              <div key={i} className={`card p-6 border-l-4 ${phase.status === 'done' ? 'border-l-success' : phase.status === 'current' ? 'border-l-primary' : 'border-l-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{phase.phase}</span>
                    <h3 className="text-heading-sm text-gray-900">{phase.title}</h3>
                  </div>
                  <span className={`badge ${phase.status === 'done' ? 'badge-live' : phase.status === 'current' ? 'badge-pending' : 'badge-gray'}`}>
                    {phase.status === 'done' ? 'Done' : phase.status === 'current' ? 'In progress' : 'Planned'}
                  </span>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${phase.status === 'done' ? 'bg-success' : phase.status === 'current' ? 'bg-primary' : 'bg-gray-300'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
