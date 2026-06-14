
import { useNavigate } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import WizardProgress from '../components/WizardProgress'
import WizardStep1 from '../components/WizardStep1'
import WizardStep2 from '../components/WizardStep2'
import WizardStep3 from '../components/WizardStep3'
import WizardStep4 from '../components/WizardStep4'
import WizardPreview from '../components/WizardPreview'
import { useWizardStore } from '../stores/wizardStore'
import { useWizardDraft } from '../hooks/useWizardDraft'
import { APP_NAME } from '../lib/constants'

const STEPS = ['About', 'Vibe', 'Template', 'Domain']

export default function WizardDemo() {
  const navigate = useNavigate()
  const { step, setStep } = useWizardStore()
  const { clearDraft } = useWizardDraft()

  const handleNext = () => setStep(Math.min(step + 1, 4))
  const handleBack = () => setStep(Math.max(step - 1, 1))
  const handleSubmit = () => {
    clearDraft()
    navigate('/register?from=wizard')
  }

  return (
    <>
      <PageMeta title="Try the Wizard" description={`See how ${APP_NAME} builds your site in minutes. No account needed to try.`} />
      <div className="min-h-screen bg-gray-50">
        <div className="container-page py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-heading-md text-gray-900">Build your site in demo mode</h1>
              <p className="text-body-sm text-gray-500 mt-1">Create an account to actually launch it.</p>
            </div>

            <div className="mb-8 max-w-sm mx-auto">
              <WizardProgress currentStep={step} totalSteps={4} labels={STEPS} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Steps */}
              <div className="card p-6">
                {step === 1 && <WizardStep1 onNext={handleNext} />}
                {step === 2 && <WizardStep2 onNext={handleNext} onBack={handleBack} />}
                {step === 3 && <WizardStep3 onNext={handleNext} onBack={handleBack} />}
                {step === 4 && <WizardStep4 onSubmit={handleSubmit} onBack={handleBack} />}
              </div>

              {/* Preview */}
              <div>
                <p className="text-xs text-gray-400 mb-2 text-center uppercase tracking-wider font-medium">Live preview</p>
                <WizardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
