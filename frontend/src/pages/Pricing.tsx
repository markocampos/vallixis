import React from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { PLANS } from '../lib/constants'
import { Check, Star } from 'lucide-react'

const planFeatures = {
  free: ['1 site', '50MB storage', '1GB bandwidth/mo', '.vallixis.io subdomain', 'Vallixis branding shown'],
  starter: ['1 site', '500MB storage', '10GB bandwidth/mo', 'Custom domain support', 'Remove branding', 'Email support'],
  maker: ['3 sites', '2GB storage', '50GB bandwidth/mo', 'Custom domains', 'Remove branding', 'Priority support', 'Analytics'],
  pro: ['10 sites', '10GB storage', '200GB bandwidth/mo', 'Custom domains', 'Remove branding', 'Priority support', 'Full analytics', 'White-label option']
}

export default function Pricing() {
  
  return (
    <>
      <PageMeta
        title="Pricing"
        description="Simple, honest pricing in Philippine Peso. Starting at P250/month. No hidden fees."
        ogImage="/og-pricing.jpg"
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="text-center mb-12">
            <h1 className="text-heading-lg text-gray-900 mb-4">Simple, honest pricing</h1>
            <p className="text-body-md text-gray-500">All prices in Philippine Peso. Billed monthly. Cancel anytime.</p>

            {/* Founder pricing banner */}
            <div className="mt-6 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
              <Star size={16} />
              Founder pricing: P150/mo locked forever. Only 20 spots remaining.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {Object.entries(PLANS).map(([key, plan]) => (
              <div key={key} className={`card p-6 flex flex-col ${key === 'starter' ? 'border-primary ring-2 ring-primary relative' : ''}`}>
                {key === 'starter' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-heading-sm text-gray-900 mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.displayPrice}</span>
                    {plan.price > 0 && <span className="text-sm text-gray-400">/mo</span>}
                  </div>
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {planFeatures[key as keyof typeof planFeatures].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={14} className="text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.price === 0 ? '/register' : '/register?plan=' + key}
                  className={key === 'starter' ? 'btn-primary text-center' : 'btn-outline text-center'}
                >
                  {plan.price === 0 ? 'Start free' : 'Get started'}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            All plans use PayMongo for secure payment. Prices in PHP (Philippine Peso).
          </p>
        </div>
      </section>
    </>
  )
}
