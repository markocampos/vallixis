import React from 'react'
import { useWizardStore } from '../stores/wizardStore'
import DomainInput from './DomainInput'
import LogoUploader from './LogoUploader'
import { slugify } from '../lib/validate'

interface WizardStep4Props {
  onSubmit: () => void
  onBack: () => void
  isLoading?: boolean
}

export default function WizardStep4({ onSubmit, onBack, isLoading }: WizardStep4Props) {
  const { domainSlug, logo, businessName, setField } = useWizardStore()

  // Auto-fill slug from business name if empty
  React.useEffect(() => {
    if (!domainSlug && businessName) {
      setField('domainSlug', slugify(businessName))
    }
  }, [businessName])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-heading-md text-gray-900 mb-1">Final touches</h2>
        <p className="text-body-sm text-gray-500">Set your web address and upload a logo.</p>
      </div>

      <DomainInput
        value={domainSlug}
        onChange={(v) => setField('domainSlug', v)}
        suffix=".vallixis.io"
      />

      <LogoUploader
        value={logo}
        onChange={(v) => setField('logo', v)}
      />

      <div className="flex gap-3">
        <button className="btn-ghost flex-1" onClick={onBack} disabled={isLoading}>Back</button>
        <button
          className="btn-primary flex-1"
          disabled={!domainSlug || isLoading}
          onClick={onSubmit}
        >
          {isLoading ? 'Building your site…' : 'Launch My Site'}
        </button>
      </div>
    </div>
  )
}
