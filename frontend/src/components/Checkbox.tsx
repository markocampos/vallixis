
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Checkbox({ label, error, className = '', id, ...props }: CheckboxProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="flex items-start gap-2.5 cursor-pointer group">
        <input
          id={inputId}
          type="checkbox"
          className={`mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer ${className}`}
          {...props}
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
      </label>
      {error && <p className="text-xs text-danger mt-1 ml-6">{error}</p>}
    </div>
  )
}
