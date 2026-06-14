import PageMeta from '../../components/PageMeta'
import { APP_NAME } from '../../lib/constants'

export default function Privacy() {
  return (
    <>
      <PageMeta title="Privacy Policy" description={`${APP_NAME} Privacy Policy`} />
      <section className="section-padding">
        <div className="container-page max-w-2xl mx-auto">
          <h1 className="text-heading-lg text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-caption text-gray-400 mb-10">Last updated: {new Date().getFullYear()}</p>

          <div className="space-y-6 text-body-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Information we collect</h2>
              <p>We collect information you provide when creating an account: your name, email address, and password. We also collect usage data and logs necessary to provide the hosting service.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">How we use your information</h2>
              <p>We use your information to provide, maintain, and improve the {APP_NAME} service. We do not sell your personal information to third parties.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Data storage</h2>
              <p>Your data is stored securely in encrypted databases. We use industry-standard security practices to protect your information.</p>
            </section>
            <section>
              <h2 className="text-heading-sm text-gray-900 mb-2">Contact</h2>
              <p>For privacy concerns, contact us at <a href="mailto:privacy@vallixis.io" className="text-primary hover:underline">privacy@vallixis.io</a>.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
