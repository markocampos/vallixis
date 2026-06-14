import PageMeta from '../../components/PageMeta'
import AssetThumbnail from '../../components/AssetThumbnail'
import { Upload, Image as ImageIcon } from 'lucide-react'

export default function Assets() {
  const assets: any[] = [] // TODO: Phase 1 — fetch from API

  return (
    <>
      <PageMeta title="Assets" />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-md text-gray-900">Assets</h1>
          <button className="btn-primary gap-2">
            <Upload size={16} />
            Upload files
          </button>
        </div>

        {assets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={24} className="text-primary" />
            </div>
            <h3 className="text-heading-sm text-gray-900 mb-2">No assets yet</h3>
            <p className="text-sm text-gray-500 mb-5">Upload images, logos, and documents for your sites.</p>
            <button className="btn-primary gap-2">
              <Upload size={16} />
              Upload your first file
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {assets.map((asset) => (
              <AssetThumbnail key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
