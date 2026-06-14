import PageMeta from '../components/PageMeta'
import { APP_NAME } from '../lib/constants'

export default function About() {
  return (
    <>
      <PageMeta title="About" description={`Learn about ${APP_NAME} and the team behind it.`} />
      <section className="section-padding">
        <div className="container-page max-w-2xl mx-auto prose prose-gray">
          <h1 className="text-heading-lg text-gray-900 mb-6">About {APP_NAME}</h1>
          <p className="text-body-md text-gray-600 mb-4">
            {APP_NAME} was built with one goal: to make professional websites accessible to every solo entrepreneur in the Philippines, regardless of technical ability or budget.
          </p>
          <p className="text-body-md text-gray-600 mb-4">
            We believe a small business owner in Cebu deserves the same quality online presence as a startup in Metro Manila. A great website shouldn't require a developer or a big investment.
          </p>
          <p className="text-body-md text-gray-600 mb-4">
            Answer four questions. Get a live site with domain and SSL. That's it.
          </p>
          <h2 className="text-heading-md text-gray-900 mt-10 mb-4">Our values</h2>
          <ul className="space-y-3 text-body-sm text-gray-600">
            <li><strong className="text-gray-900">Simplicity:</strong> Everything we build should be usable by a first-time website owner.</li>
            <li><strong className="text-gray-900">Transparency:</strong> Honest pricing. No hidden fees. What you see is what you pay.</li>
            <li><strong className="text-gray-900">Local first:</strong> Prices in PHP. Payment via PayMongo. Built for the Philippine market.</li>
          </ul>
        </div>
      </section>
    </>
  )
}
