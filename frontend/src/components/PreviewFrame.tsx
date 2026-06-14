
interface PreviewFrameProps {
  src?: string
  title?: string
  className?: string
}

export default function PreviewFrame({ src, title = 'Site preview', className = '' }: PreviewFrameProps) {
  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {/* Browser chrome */}
      <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-danger opacity-60" />
          <div className="w-3 h-3 rounded-full bg-warning opacity-60" />
          <div className="w-3 h-3 rounded-full bg-success opacity-60" />
        </div>
        <div className="flex-1 bg-white rounded px-3 py-0.5 text-xs text-gray-400 text-center">
          {title}
        </div>
      </div>
      {src ? (
        <iframe
          src={src}
          title={title}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400 text-sm py-20">
          Preview will appear here
        </div>
      )}
    </div>
  )
}
