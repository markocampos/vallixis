import PageMeta from '../../components/PageMeta'
import { APP_NAME } from '../../lib/constants'

export default function Terms() {
  return (
    <>
      <PageMeta title="Terms of Service" description={`${APP_NAME} Terms of Service`} />
      <section className="section-padding">
        <div className="container-page max-w-2xl mx-auto">
          <h1 className="text-heading-lg text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-caption text-gray-400 mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="space-y-6 text-body-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Acceptance of terms</h2>
              <p>By creating an account and using {APP_NAME}, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Acceptable use</h2>
              <p>You may not use {APP_NAME} to host illegal content, engage in spam, or violate the rights of others. We reserve the right to suspend accounts that violate these terms.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Service availability</h2>
              <p>We strive for high availability but cannot guarantee 100% uptime. We are not liable for any damages caused by service interruptions.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Payments</h2>
              <p>All payments are processed via PayMongo in Philippine Peso. Billing is monthly. You can cancel at any time from your account settings.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
