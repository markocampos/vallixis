import React, { useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface LogoUploaderProps {
  value: string | null
  onChange: (v: string | null) => void
}

export default function LogoUploader({ value, onChange }: LogoUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="label">Logo (optional)</label>
      {value ? (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <img src={value} alt="Logo preview" className="w-14 h-14 object-contain rounded" />
          <div className="flex-1">
            <p className="text-sm text-gray-700 font-medium">Logo uploaded</p>
            <p className="text-xs text-gray-400">Click remove to change it</p>
          </div>
          <button
            onClick={() => onChange(null)}
            className="p-1.5 text-gray-400 hover:text-danger transition-colors"
            aria-label="Remove logo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary-light transition-colors"
        >
          <Upload size={24} className="text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">Upload logo</span>
          <span className="text-xs text-gray-400">PNG, JPG, SVG up to 2MB</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
