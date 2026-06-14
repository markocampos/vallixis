import { useWizardStore } from '../stores/wizardStore'

interface WizardStep1Props {
  onNext: () => void
}

export default function WizardStep1({ onNext }: WizardStep1Props) {
  const { businessName, description, setField } = useWizardStore()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-heading-md text-gray-900 mb-1">Tell us about your business</h2>
        <p className="text-body-sm text-gray-500">We'll use this to build your site.</p>
      </div>

      <div>
        <label className="label" htmlFor="businessName">Business Name *</label>
        <input
          id="businessName"
          type="text"
          className="input"
          placeholder="e.g. Maria's Bakeshop"
          value={businessName}
          onChange={(e) => setField('businessName', e.target.value)}
          maxLength={100}
        />
      </div>

      <div>
        <label className="label" htmlFor="description">What do you do? *</label>
        <textarea
          id="description"
          className="input resize-none"
          placeholder="e.g. We make homemade pastries and cakes for special occasions in Cebu."
          value={description}
          onChange={(e) => setField('description', e.target.value)}
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>
      </div>

      <button
        className="btn-primary w-full btn-lg"
        disabled={!businessName.trim() || !description.trim()}
        onClick={onNext}
      >
        Continue
      </button>
    </div>
  )
}
