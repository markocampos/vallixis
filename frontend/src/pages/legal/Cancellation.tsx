import PageMeta from '../../components/PageMeta'
import { APP_NAME } from '../../lib/constants'

export default function Cancellation() {
  return (
    <>
      <PageMeta title="Cancellation Policy" description={`${APP_NAME} Cancellation Policy`} />
      <section className="section-padding">
        <div className="container-page max-w-2xl mx-auto">
          <h1 className="text-heading-lg text-gray-900 mb-2">Cancellation Policy</h1>
          <p className="text-caption text-gray-400 mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="space-y-6 text-body-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">How to cancel</h2>
              <p>You can cancel your subscription at any time from your billing settings page. No need to contact support, it's fully self-service.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">What happens after cancellation</h2>
              <p>Your site remains live until the end of your current billing period. After that, it will be downgraded to the free plan or deactivated if you had a paid-only plan.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Refunds</h2>
              <p>We do not offer refunds for partial months. If you cancel mid-month, you retain access until the period ends.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Data retention</h2>
              <p>After account deletion, your data is retained for 30 days before permanent deletion. You can request immediate deletion by contacting support.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
