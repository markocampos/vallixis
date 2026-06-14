import React, { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-success" />,
  error: <AlertCircle size={18} className="text-danger" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info: <Info size={18} className="text-primary" />
}

const borderColors: Record<ToastType, string> = {
  success: 'border-l-success',
  error: 'border-l-danger',
  warning: 'border-l-warning',
  info: 'border-l-primary'
}

export default function Toast({ message, type = 'info', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  return (
    <div className={`flex items-start gap-3 bg-white shadow-lg border border-gray-200 border-l-4 ${borderColors[type]} rounded-lg p-4 min-w-72 max-w-sm`}>
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <p className="text-sm text-gray-800 flex-1 leading-relaxed">{message}</p>
      <button onClick={onClose} className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
        <X size={14} />
      </button>
    </div>
  )
}
