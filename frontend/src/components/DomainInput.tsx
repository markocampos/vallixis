import { isValidSlug } from '../lib/validate'

interface DomainInputProps {
  value: string
  onChange: (v: string) => void
  suffix?: string
  error?: string
}

export default function DomainInput({ value, onChange, suffix = '.vallixis.io', error }: DomainInputProps) {
  const isValid = !value || isValidSlug(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    onChange(v)
  }

  return (
    <div>
      <label className="label">Your web address *</label>
      <div className={`flex items-center border rounded-md overflow-hidden transition-colors ${
        !isValid || error ? 'border-danger' : 'border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary'
      }`}>
        <input
          type="text"
          className="flex-1 px-3 py-2.5 text-sm bg-white outline-none text-gray-900 placeholder:text-gray-400"
          placeholder="myshop"
          value={value}
          onChange={handleChange}
          maxLength={50}
          minLength={3}
        />
        <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-l border-gray-300 shrink-0">
          {suffix}
        </span>
      </div>
      {!isValid && (
        <p className="text-xs text-danger mt-1">Use only lowercase letters, numbers, and hyphens (3 to 50 chars)</p>
      )}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
      {isValid && value && (
        <p className="text-xs text-success mt-1">✓ {value}{suffix}</p>
      )}
    </div>
  )
}
