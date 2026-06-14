import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { APP_NAME, PLANS } from '../lib/constants'
import { ArrowRight, Globe, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <>
      <PageMeta
        title="Managed Hosting for Solo Entrepreneurs"
        description="Get a live custom website with domain and SSL in minutes. No code required. Starting at P250/month."
        ogImage="/og-home.jpg"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-white">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 z-0 opacity-[0.15]" 
             style={{ backgroundImage: 'radial-gradient(#8B2635 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>
        {/* Soft radial fade to ensure text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/40 via-white/80 to-white"></div>

        <div className="container-page relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-display-xl text-gray-900 mb-6">
            Your business online in <span className="text-primary font-bold">minutes</span>, not months
          </h1>
          <p className="text-body-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Answer 4 questions. Get a live website with a custom domain and SSL certificate.
            No developers. No complicated dashboards. Just your business, online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/wizard-demo" className="btn-primary btn-lg gap-2 shadow-lg shadow-primary/20 transform transition hover:-translate-y-1">
              Try the Wizard Free <ArrowRight size={18} />
            </Link>
            <Link to="/templates" className="btn-outline btn-lg transform transition hover:-translate-y-1 bg-white">
              See Templates
            </Link>
          </div>
          <p className="text-caption text-gray-400 mt-6">No credit card required for demo</p>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-gray-50">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-heading-lg text-gray-900 mb-4">Everything you need, nothing you don't</h2>
            <p className="text-body-md text-gray-500 max-w-xl mx-auto">Built specifically for solo entrepreneurs in the Philippines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap size={24} />, title: 'Live in minutes', desc: 'Answer our wizard, get a live website. SSL included automatically.' },
              { icon: <Globe size={24} />, title: 'Custom domain', desc: 'Get a free .vallixis.io domain or connect your own. DuckDNS or custom.' },
              { icon: <Shield size={24} />, title: 'Fully managed', desc: 'We handle hosting, backups, security, and updates. You focus on business.' }
            ].map((f, i) => (
              <div key={i} className="card p-6">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="text-heading-sm text-gray-900 mb-2">{f.title}</h3>
                <p className="text-body-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="section-padding bg-white">
        <div className="container-page text-center">
          <h2 className="text-heading-lg text-gray-900 mb-4">Simple, honest pricing</h2>
          <p className="text-body-md text-gray-500 mb-10">All plans in Philippine Peso. No hidden fees.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <div key={key} className={`card p-5 text-center ${key === 'starter' ? 'border-primary ring-1 ring-primary' : ''}`}>
                <p className="text-caption text-gray-500 uppercase tracking-wider mb-1">{plan.name}</p>
                <p className="text-2xl font-bold text-gray-900">{plan.displayPrice}</p>
                <p className="text-xs text-gray-400">/ month</p>
              </div>
            ))}
          </div>
          <Link to="/pricing" className="btn-outline">
            See full pricing →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark">
        <div className="container-page text-center">
          <h2 className="text-heading-lg text-white mb-4">Ready to get started?</h2>
          <p className="text-body-md text-gray-400 mb-8">Join solo entrepreneurs building their business online with {APP_NAME}.</p>
          <Link to="/register" className="btn-primary btn-lg">
            Create your free account
          </Link>
        </div>
      </section>
    </>
  )
}
