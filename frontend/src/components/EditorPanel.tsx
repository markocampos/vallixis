
interface EditorPanelProps {
  children: React.ReactNode
  title?: string
}

export default function EditorPanel({ children, title }: EditorPanelProps) {
  return (
    <div className="card h-full flex flex-col">
      {title && (
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="flex-1 overflow-auto p-5">
        {children}
      </div>
    </div>
  )
}
