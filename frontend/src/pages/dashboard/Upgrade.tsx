import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import { PLANS, formatPHP } from '../../lib/constants'
import { Check, CreditCard, ArrowLeft, Shield, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const planFeatures = {
  starter: ['1 site', '500MB storage', '10GB bandwidth/mo', 'Custom domain support', 'Remove branding', 'Email support'],
  maker: ['3 sites', '2GB storage', '50GB bandwidth/mo', 'Custom domains', 'Remove branding', 'Priority support', 'Analytics'],
  pro: ['10 sites', '10GB storage', '200GB bandwidth/mo', 'Custom domains', 'Remove branding', 'Priority support', 'Full analytics', 'White-label option']
}

type PaymentMethod = 'card' | 'gcash' | 'maya'

export default function Upgrade() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const planKey = searchParams.get('plan') as keyof typeof PLANS | null

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const plan = planKey && PLANS[planKey] && PLANS[planKey].price > 0 ? PLANS[planKey] : null
  const features = planKey && planFeatures[planKey as keyof typeof planFeatures] || []

  useEffect(() => {
    if (!planKey || !plan) {
      navigate('/pricing')
    }
  }, [planKey, plan, navigate])

  if (!plan || !planKey) return null

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post<{ data: { checkout_url?: string; subscription_id?: string } }>('/billing/checkout', {
        plan: planKey,
        paymentMethod
      })

      if (res.data.data?.checkout_url) {
        window.location.href = res.data.data.checkout_url
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <PageMeta title="Upgrade Successful" />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-success" />
            </div>
            <h2 className="text-heading-sm text-gray-900 mb-2">You're all set!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your {plan.name} plan is now active. You have access to all features.
            </p>
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageMeta title={`Upgrade to ${plan.name}`} />
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to pricing
        </Link>

        <h1 className="text-heading-md text-gray-900 mb-1">Upgrade to {plan.name}</h1>
        <p className="text-sm text-gray-500 mb-8">You're one step away from unlocking {plan.name} features.</p>

        {error && (
          <div className="bg-red-50 border border-danger/20 text-danger text-sm px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Plan summary */}
          <div className="md:col-span-2">
            <div className="card p-5 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{plan.name} Plan</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-primary">{plan.displayPrice}</span>
                <span className="text-sm text-gray-400">/month</span>
              </div>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-success mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment form */}
          <div className="md:col-span-3">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Choose payment method</h3>

              <div className="space-y-3 mb-6">
                {[
                  { key: 'card' as PaymentMethod, label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
                  { key: 'gcash' as PaymentMethod, label: 'GCash', icon: Shield, desc: 'Pay with your GCash wallet' },
                  { key: 'maya' as PaymentMethod, label: 'Maya', icon: Shield, desc: 'Pay with your Maya wallet' },
                ].map(({ key, label, icon: Icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === key
                        ? 'border-primary bg-primary-light'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      paymentMethod === key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === key ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === key && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{plan.name} plan</span>
                  <span className="font-semibold text-gray-900">{plan.displayPrice}/mo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billed monthly</span>
                  <span className="text-gray-500">Cancel anytime</span>
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-gray-900">Due today</span>
                  <span className="text-lg font-bold text-primary">{plan.displayPrice}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full btn-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock size={16} />
                    Pay {plan.displayPrice}
                  </span>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Secured by PayMongo. Your payment info is encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
