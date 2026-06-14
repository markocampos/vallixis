
interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export default function WizardProgress({ currentStep, totalSteps, labels }: WizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium">Step {currentStep} of {totalSteps}</span>
        <span className="text-xs text-primary font-semibold">{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      {labels && (
        <div className="flex justify-between mt-2">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`text-xs font-medium ${i < currentStep ? 'text-primary' : 'text-gray-300'}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
