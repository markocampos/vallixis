import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import TemplateWireframe from '../components/TemplateWireframe'
import { TEMPLATES, VIBES } from '../lib/constants'

const templateInfo = {
  business: { title: 'Business', desc: 'For services, shops, and local businesses. Includes hero, features, testimonials, and contact form.' },
  portfolio: { title: 'Portfolio', desc: 'Showcase your work and skills. Project gallery, bio, and skills section.' },
  ecommerce: { title: 'E-Commerce', desc: 'Sell products online. Product listings, pricing, and checkout-ready layout.' }
}

export default function Templates() {
  return (
    <>
      <PageMeta
        title="Templates"
        description="Choose from business, portfolio, or e-commerce site templates. Each adapts to your chosen vibe."
        ogImage="/og-templates.jpg"
      />

      <section className="section-padding">
        <div className="container-page">
          <div className="text-center mb-12">
            <h1 className="text-heading-lg text-gray-900 mb-4">Pick your starting point</h1>
            <p className="text-body-md text-gray-500 max-w-lg mx-auto">
              Three templates. Four vibes. Twelve combinations. All fully managed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEMPLATES.map((t) => (
              <div key={t} className="card overflow-hidden">
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-2">
                    {(['warm', 'modern'] as const).map((v) => (
                      <div key={v}>
                        <p className="text-xs text-gray-400 mb-1 capitalize">{v}</p>
                        <TemplateWireframe template={t} vibe={v} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-heading-sm text-gray-900 mb-2">{templateInfo[t as keyof typeof templateInfo].title}</h3>
                  <p className="text-body-sm text-gray-500 mb-4">{templateInfo[t as keyof typeof templateInfo].desc}</p>
                  <Link to={`/wizard-demo?template=${t}`} className="btn-outline btn-sm w-full text-center">
                    Try this template
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-heading-md text-gray-900 mb-3">Customize the vibe</h2>
            <p className="text-body-sm text-gray-500 mb-6">Each template comes in four vibes.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {VIBES.map((v) => (
                <span key={v} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium capitalize text-gray-700">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
