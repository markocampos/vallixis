import { useWizardStore } from '../stores/wizardStore'
import { TEMPLATES } from '../lib/constants'
import TemplateWireframe from './TemplateWireframe'

const templateDescriptions: Record<string, string> = {
  business: 'Professional layout for services, shops, and local businesses.',
  portfolio: 'Showcase work, projects, and skills for freelancers and creatives.',
  ecommerce: 'Product listings and sales pages for online sellers.'
}

interface WizardStep3Props {
  onNext: () => void
  onBack: () => void
}

export default function WizardStep3({ onNext, onBack }: WizardStep3Props) {
  const { template, setField } = useWizardStore()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-heading-md text-gray-900 mb-1">Pick your template</h2>
        <p className="text-body-sm text-gray-500">You can change this later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <div
            key={t}
            className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
              template === t ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-primary'
            }`}
            onClick={() => setField('template', t)}
          >
            <TemplateWireframe template={t} vibe="modern" />
            <p className="text-sm font-semibold text-gray-900 mt-3 capitalize">{t}</p>
            <p className="text-xs text-gray-500 mt-1">{templateDescriptions[t]}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="btn-ghost flex-1" onClick={onBack}>Back</button>
        <button
          className="btn-primary flex-1"
          disabled={!template}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
