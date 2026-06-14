import { useWizardStore } from '../stores/wizardStore'
import VibeCard from './VibeCard'
import { VIBES } from '../lib/constants'

const vibeDescriptions: Record<string, string> = {
  warm: 'Inviting & friendly. Great for food, wellness, and lifestyle.',
  modern: 'Clean & professional. Great for tech and services.',
  bold: 'Strong & energetic. Great for fitness and bold brands.',
  minimal: 'Simple & elegant. Great for portfolios and creatives.'
}

interface WizardStep2Props {
  onNext: () => void
  onBack: () => void
}

export default function WizardStep2({ onNext, onBack }: WizardStep2Props) {
  const { vibe, setField } = useWizardStore()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-heading-md text-gray-900 mb-1">Choose your vibe</h2>
        <p className="text-body-sm text-gray-500">This sets the mood of your site.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {VIBES.map((v) => (
          <VibeCard
            key={v}
            vibe={v}
            description={vibeDescriptions[v]}
            selected={vibe === v}
            onSelect={() => setField('vibe', v)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button className="btn-ghost flex-1" onClick={onBack}>Back</button>
        <button
          className="btn-primary flex-1"
          disabled={!vibe}
          onClick={onNext}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
