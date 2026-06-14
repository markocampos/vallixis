import React from 'react'
import { useNavigate } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import WizardProgress from '../../components/WizardProgress'
import WizardStep1 from '../../components/WizardStep1'
import WizardStep2 from '../../components/WizardStep2'
import WizardStep3 from '../../components/WizardStep3'
import WizardStep4 from '../../components/WizardStep4'
import WizardPreview from '../../components/WizardPreview'
import { useWizardStore } from '../../stores/wizardStore'
import { useWizardDraft } from '../../hooks/useWizardDraft'

const STEPS = ['About', 'Vibe', 'Template', 'Domain']

export default function WizardReal() {
  const navigate = useNavigate()
  const { step, setStep, reset } = useWizardStore()
  const { clearDraft } = useWizardDraft()
  const [loading, setLoading] = React.useState(false)

  const handleNext = () => setStep(Math.min(step + 1, 4))
  const handleBack = () => setStep(Math.max(step - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // TODO: Phase 1 — submit to /v1/sites endpoint
      await new Promise(r => setTimeout(r, 1500)) // placeholder
      clearDraft()
      reset()
      navigate('/dashboard/sites')
    } catch {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta title="Create New Site" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-heading-md text-gray-900">Create a new site</h1>
          <p className="text-sm text-gray-500 mt-1">Answer a few questions and we'll build it for you.</p>
        </div>

        <div className="mb-6">
          <WizardProgress currentStep={step} totalSteps={4} labels={STEPS} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            {step === 1 && <WizardStep1 onNext={handleNext} />}
            {step === 2 && <WizardStep2 onNext={handleNext} onBack={handleBack} />}
            {step === 3 && <WizardStep3 onNext={handleNext} onBack={handleBack} />}
            {step === 4 && <WizardStep4 onSubmit={handleSubmit} onBack={handleBack} isLoading={loading} />}
          </div>
          <div>
            <p className="text-xs text-gray-400 text-center mb-2 uppercase tracking-wider font-medium">Live preview</p>
            <WizardPreview />
          </div>
        </div>
      </div>
    </>
  )
}
