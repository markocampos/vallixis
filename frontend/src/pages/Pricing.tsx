import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { PLANS } from '../lib/constants'
import { Check, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const planFeatures = {
  free: ['1 site', '50MB storage', '1GB bandwidth/mo', '.vallixis.io subdomain', 'Vallixis branding shown'],
  founder: ['1 site', '500MB storage', '10GB bandwidth/mo', 'Custom domain support', 'Remove branding', 'Email support', 'Locked at P150/mo forever'],
  starter: ['1 site', '500MB storage', '10GB bandwidth/mo', 'Custom domain support', 'Remove branding', 'Email support'],
  maker: ['3 sites', '2GB storage', '50GB bandwidth/mo', 'Custom domains', 'Remove branding', 'Priority support', 'Analytics'],
  pro: ['10 sites', '10GB storage', '200GB bandwidth/mo', 'Custom domains', 'Remove branding', 'Priority support', 'Full analytics', 'White-label option']
}

export default function Pricing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const selectedPlan = searchParams.get('plan')

  const handleSelectPlan = (planKey: string) => {
    setSearchParams({ plan: planKey })
  }

  const getCtaLink = (planKey: string, isFree: boolean) => {
    if (isFree) return '/register'
    if (isAuthenticated) return `/dashboard/upgrade?plan=${planKey}`
    return `/register?plan=${planKey}`
  }

  // Separate founder from regular plans
  const regularPlans = Object.entries(PLANS).filter(([key]) => key !== 'founder')
  const founderPlan = PLANS.founder

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
          </div>

          {/* Founder pricing card — special highlight */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="card p-6 border-2 border-primary relative bg-primary-light/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-white" />
                  Limited to 20 spots
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                <div>
                  <h3 className="text-heading-sm text-gray-900 mb-1">Founder Plan</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">P150</span>
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Same as Starter, locked at P150/mo forever. Price will never increase.</p>
                </div>

                <ul className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3 sm:mb-0">
                  {planFeatures.founder.map((f, i) => (
                    <li key={i} className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                      <Check size={10} className="text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={getCtaLink('founder', false)}
                  className="btn-primary btn-sm shrink-0"
                >
                  Claim founder spot
                </Link>
              </div>
            </div>
          </div>

          {/* Regular plans */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {regularPlans.map(([key, plan]) => {
              const isSelected = selectedPlan === key
              const isPopular = key === 'starter'

              return (
                <div
                  key={key}
                  onClick={() => handleSelectPlan(key)}
                  className={`card p-6 flex flex-col cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary relative scale-[1.02]'
                      : isPopular
                        ? 'border-primary relative'
                        : 'hover:border-gray-300'
                  }`}
                >
                  {isPopular && (
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
                    to={getCtaLink(key, plan.price === 0)}
                    onClick={(e) => e.stopPropagation()}
                    className={isPopular || isSelected ? 'btn-primary text-center' : 'btn-outline text-center'}
                  >
                    {plan.price === 0 ? 'Start free' : 'Get started'}
                  </Link>
                </div>
              )
            })}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            All plans use PayMongo for secure payment. Prices in PHP (Philippine Peso).
          </p>
        </div>
      </section>
    </>
  )
}
