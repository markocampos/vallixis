import { FileImage, Trash2 } from 'lucide-react'
import type { Asset } from '../types'

interface AssetThumbnailProps {
  asset: Asset
  onDelete?: (id: string) => void
  selected?: boolean
  onClick?: () => void
}

export default function AssetThumbnail({ asset, onDelete, selected, onClick }: AssetThumbnailProps) {
  const isImage = asset.mime_type.startsWith('image/')

  return (
    <div
      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        selected ? 'border-primary' : 'border-gray-200 hover:border-primary'
      }`}
      onClick={onClick}
    >
      {isImage ? (
        <img
          src={asset.url_path}
          alt={asset.original_name}
          className="w-full h-24 object-cover bg-gray-100"
        />
      ) : (
        <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
          <FileImage size={24} className="text-gray-400" />
        </div>
      )}

      <div className="p-2 bg-white">
        <p className="text-xs text-gray-600 truncate">{asset.original_name}</p>
        <p className="text-xs text-gray-400">{(asset.size_bytes / 1024).toFixed(1)} KB</p>
      </div>

      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(asset.id) }}
          className="absolute top-1 right-1 p-1 bg-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity text-danger hover:bg-red-50"
          aria-label="Delete asset"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  )
}
