import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import AnimatedGrid from '../components/AnimatedGrid'
import { APP_NAME } from '../lib/constants'
import {
  ArrowRight, Globe, Shield, Zap, Clock, CreditCard,
  ChevronDown, Check, Star, Users, BarChart2, Lock
} from 'lucide-react'

const steps = [
  {
    num: '1',
    title: 'Tell us about your business',
    desc: 'Your name, what you do, and the vibe you want. Takes about 30 seconds.',
  },
  {
    num: '2',
    title: 'Pick a template',
    desc: 'Choose from business, portfolio, or e-commerce. Each one is mobile-ready out of the box.',
  },
  {
    num: '3',
    title: 'Set your domain',
    desc: 'Use a free .vallixis.io subdomain or connect your own. We handle the DNS.',
  },
  {
    num: '4',
    title: 'Go live',
    desc: 'SSL certificate, hosting, backups — all handled. Your site is live in under 2 minutes.',
  },
]

const features = [
  {
    icon: <Zap size={20} />,
    title: 'Under 2 minutes',
    desc: 'From first click to live site. No waiting for developers, no back-and-forth emails.',
  },
  {
    icon: <Globe size={20} />,
    title: 'Your own domain',
    desc: 'Free subdomain included. Or bring your own — we set up DNS and SSL for you.',
  },
  {
    icon: <Shield size={20} />,
    title: 'SSL by default',
    desc: 'Every site gets a free SSL certificate. No configuration, no extra cost.',
  },
  {
    icon: <Lock size={20} />,
    title: 'Fully managed',
    desc: 'Hosting, backups, security patches, uptime monitoring. You don\'t touch a server.',
  },
  {
    icon: <CreditCard size={20} />,
    title: 'Pay in PHP',
    desc: 'All pricing in Philippine Peso. PayMongo supports GCash, Maya, cards, and more.',
  },
  {
    icon: <Clock size={20} />,
    title: 'Cancel anytime',
    desc: 'No contracts, no lock-in. Downgrade or cancel from your dashboard whenever you want.',
  },
]

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Bakeshop owner, Cebu',
    quote: 'I had a website up in 10 minutes. My customers can finally find me online and place orders.',
  },
  {
    name: 'Jay Reyes',
    role: 'Freelance photographer',
    quote: 'The portfolio template looks clean. I stopped paying Wix and moved everything here in an afternoon.',
  },
  {
    name: 'Ana Cruz',
    role: 'Online seller, Manila',
    quote: 'I was paying P2,000/month for a Squarespace site. This does the same thing for P250.',
  },
]

const faqs = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. The wizard walks you through everything. Answer a few questions, pick a template, and your site is built automatically.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. You can buy a domain elsewhere (like Namecheap or GoDaddy) and point it to Vallixis. We handle the DNS setup and SSL certificate.',
  },
  {
    q: 'What happens to my site if I stop paying?',
    a: 'Your site goes offline after the billing period ends. Your data is kept for 30 days. Come back anytime and your site is still there.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. The Free plan gives you 1 site on a .vallixis.io subdomain with 50MB storage. No credit card needed.',
  },
  {
    q: 'Can I edit my site after it\'s live?',
    a: 'Yes. The site editor lets you change text, images, colors, and layout. Changes go live immediately.',
  },
  {
    q: 'Who owns my data?',
    a: 'You do. Export everything from your dashboard anytime. We don\'t sell your data or show ads on your site.',
  },
]

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-gray-900 pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-4' : 'max-h-0'}`}
      >
        <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <PageMeta
        title="Managed Hosting for Solo Entrepreneurs"
        description="Get a live custom website with domain and SSL in minutes. No code required. Starting at P250/month."
        ogImage="/og-home.jpg"
      />

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-white overflow-hidden">
        <AnimatedGrid count={100} />
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Star size={12} />
              Built for solo entrepreneurs in the Philippines
            </div>

            <h1 className="text-display-xl text-gray-900 mb-5 leading-tight">
              Your business online{' '}
              <span className="text-primary">in minutes</span>
            </h1>

            <p className="text-body-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
              Answer 4 questions. Get a live website with your own domain, SSL, and hosting.
              No developers. No page builders. Just your business, online.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/wizard-demo"
                className="btn-primary btn-lg gap-2"
              >
                Try it free <ArrowRight size={18} />
              </Link>
              <Link to="/templates" className="btn-outline btn-lg bg-white">
                Browse templates
              </Link>
            </div>

            <p className="text-caption text-gray-400 mt-4">
              Free plan available. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-heading-lg text-gray-900 mb-3">How it works</h2>
            <p className="text-body-md text-gray-500">Four steps. Two minutes. Done.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-heading-lg text-gray-900 mb-3">Everything you need</h2>
            <p className="text-body-md text-gray-500 max-w-lg mx-auto">
              We handle the technical stuff so you can focus on your business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="card p-5">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center text-primary mb-3">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { value: '< 2 min', label: 'Average setup time' },
              { value: 'P0', label: 'Free plan available' },
              { value: '99.9%', label: 'Uptime guarantee' },
              { value: '24h', label: 'Support response' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-heading-lg text-gray-900 mb-3">What people say</h2>
            <p className="text-body-md text-gray-500">Real businesses, real results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-heading-lg text-gray-900 mb-3">Simple pricing</h2>
            <p className="text-body-md text-gray-500">Start free. Upgrade when you need to. All in Philippine Peso.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { name: 'Free', price: 'P0', desc: '1 site, .vallixis.io domain' },
              { name: 'Starter', price: 'P250', desc: 'Custom domain, no branding', popular: true },
              { name: 'Maker', price: 'P600', desc: '3 sites, priority support' },
              { name: 'Pro', price: 'P1,250', desc: '10 sites, API access' },
            ].map((p) => (
              <div
                key={p.name}
                className={`card p-5 text-center ${p.popular ? 'border-primary ring-1 ring-primary relative' : ''}`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{p.name}</p>
                <p className="text-2xl font-bold text-gray-900">{p.price}</p>
                <p className="text-[11px] text-gray-400 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="btn-outline">
              See full pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-page max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-heading-lg text-gray-900 mb-3">Frequently asked questions</h2>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-dark">
        <div className="container-page text-center max-w-2xl mx-auto">
          <h2 className="text-heading-lg text-white mb-3">Ready to get online?</h2>
          <p className="text-body-md text-gray-400 mb-8">
            Build your site in 2 minutes. No credit card, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/wizard-demo" className="btn-primary btn-lg gap-2">
              Try the wizard <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-outline btn-lg border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
