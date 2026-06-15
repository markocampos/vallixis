import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import PageMeta from '../components/PageMeta'
import AnimatedGrid from '../components/AnimatedGrid'
import WizardProgress from '../components/WizardProgress'
import WizardStep1 from '../components/WizardStep1'
import WizardStep2 from '../components/WizardStep2'
import WizardStep3 from '../components/WizardStep3'
import WizardStep4 from '../components/WizardStep4'
import WizardPreview from '../components/WizardPreview'
import { useWizardStore } from '../stores/wizardStore'
import { useWizardDraft } from '../hooks/useWizardDraft'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../lib/constants'
import { Sparkles, ArrowRight, Check } from 'lucide-react'

const STEPS = ['About', 'Vibe', 'Template', 'Domain']

export default function WizardDemo() {
  const navigate = useNavigate()
  const { step, setStep, reset } = useWizardStore()
  const { clearDraft } = useWizardDraft()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    reset()
    clearDraft()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => setStep(Math.min(step + 1, 4))
  const handleBack = () => setStep(Math.max(step - 1, 1))

  const handleSubmit = () => {
    clearDraft()
    if (isAuthenticated) {
      navigate('/dashboard/wizard')
    } else {
      navigate('/register?plan=free')
    }
  }

  return (
    <>
      <PageMeta
        title="Try the Wizard"
        description={`See how ${APP_NAME} builds your site in minutes. No account needed to try.`}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero banner */}
        <div className="bg-white border-b border-gray-200 relative overflow-hidden">
          <AnimatedGrid count={100} />

          <div className="container-page relative z-10 py-10 md:py-14">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4 animate-fade-in">
                <Sparkles size={12} />
                Interactive demo — no account needed
              </div>
              <h1 className="text-heading-lg text-gray-900 mb-3 animate-slide-up">
                Build your site in <span className="text-primary">4 steps</span>
              </h1>
              <p className="text-body-md text-gray-500 animate-slide-up-delay">
                Try the wizard below. When you're ready to go live, create a free account.
              </p>
            </div>
          </div>
        </div>

        <div className="container-page py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Progress */}
            <div className="mb-8 max-w-md mx-auto animate-fade-in">
              <WizardProgress currentStep={step} totalSteps={4} labels={STEPS} />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Steps */}
              <div className="lg:col-span-2">
                <div className="card p-6 animate-slide-up">
                  {step === 1 && <WizardStep1 onNext={handleNext} />}
                  {step === 2 && <WizardStep2 onNext={handleNext} onBack={handleBack} />}
                  {step === 3 && <WizardStep3 onNext={handleNext} onBack={handleBack} />}
                  {step === 4 && <WizardStep4 onSubmit={handleSubmit} onBack={handleBack} />}
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-3">
                <div className="sticky top-6">
                  <p className="text-xs text-gray-400 mb-2 text-center uppercase tracking-wider font-medium">
                    Live preview
                  </p>
                  <WizardPreview />
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="card p-6 max-w-lg mx-auto">
                {isAuthenticated ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Ready to make it real? Deploy your site with a custom domain.
                    </p>
                    <button
                      onClick={() => navigate('/dashboard/wizard')}
                      className="btn-primary gap-2"
                    >
                      Go to dashboard <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3">
                      Like what you see? Create a free account and launch your site.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => navigate('/register?plan=free')}
                        className="btn-primary gap-2"
                      >
                        Create free account <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => navigate('/login')}
                        className="btn-ghost"
                      >
                        I already have an account
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Check size={12} className="text-success" /> Free forever</span>
                      <span className="flex items-center gap-1"><Check size={12} className="text-success" /> No credit card</span>
                      <span className="flex items-center gap-1"><Check size={12} className="text-success" /> Cancel anytime</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
