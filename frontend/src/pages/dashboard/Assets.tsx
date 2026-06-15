import { useState, useEffect, useRef } from 'react'
import PageMeta from '../../components/PageMeta'
import AssetThumbnail from '../../components/AssetThumbnail'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import { Upload, Image as ImageIcon, FileText, X, Search, Grid, List, Trash2, Download, Copy, Check, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import type { Asset } from '../../types'

type FilterType = 'all' | 'images' | 'documents'
type ViewMode = 'grid' | 'list'

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filter, setFilter] = useState<FilterType>('all')
  const [view, setView] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [totalSize, setTotalSize] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchAssets() }, [filter])

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const res = await api.get<{ data: { assets: Asset[]; totalSize: number } }>('/assets', { params: { type: filter } })
      setAssets(res.data.data?.assets || [])
      setTotalSize(res.data.data?.totalSize || 0)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > 10 * 1024 * 1024) { alert('File too large. Max 10MB'); return }
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']
    if (!allowed.includes(file.type)) { alert('File type not allowed. Use JPG, PNG, GIF, WebP, SVG, or PDF'); return }

      const formData = new FormData()
      formData.append('file', file)

      try {
        await api.post('/assets', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100))
          }
        })
      } catch { /* continue */ }
    }

    setUploading(false)
    setUploadProgress(0)
    fetchAssets()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  const handleDelete = async () => {
    if (!selectedAsset) return
    setDeleting(true)
    try {
      await api.delete(`/assets/${selectedAsset.id}`)
      setAssets((prev) => prev.filter((a) => a.id !== selectedAsset.id))
      setSelectedAsset(null)
      setShowDeleteModal(false)
      fetchAssets()
    } catch { /* ignore */ }
    finally { setDeleting(false) }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredAssets = assets.filter((a) => {
    if (search) return a.original_name.toLowerCase().includes(search.toLowerCase())
    return true
  })

  return (
    <>
      <PageMeta title="Assets" />
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-md text-gray-900">Assets</h1>
            <p className="text-xs text-gray-400 mt-1">{assets.length} files · {formatSize(totalSize)} used</p>
          </div>
          <Button size="sm" onClick={() => fileInputRef.current?.click()} loading={uploading}>
            <Upload size={14} /> Upload
          </Button>
          <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="card p-3">
            <div className="flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-xs text-gray-600">Uploading... {uploadProgress}%</p>
                <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl transition-all ${
            dragOver ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {assets.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-heading-sm text-gray-900 mb-2">No assets yet</h3>
              <p className="text-sm text-gray-500 mb-5">Drag and drop files here, or click to browse.</p>
              <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload size={14} /> Upload files
              </Button>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-xs text-gray-400 text-center py-2">Drop files here to upload</p>
            </div>
          )}
        </div>

        {/* Toolbar */}
        {assets.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              {(['all', 'images', 'documents'] as FilterType[]).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}><Grid size={14} /></button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}><List size={14} /></button>
            </div>
          </div>
        )}

        {/* Assets grid/list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            {search ? 'No assets match your search' : 'No assets found'}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredAssets.map((asset) => (
              <AssetThumbnail
                key={asset.id}
                asset={asset}
                onClick={() => setSelectedAsset(asset)}
                onDelete={(id) => { setSelectedAsset(assets.find(a => a.id === id) || null); setShowDeleteModal(true) }}
              />
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">File</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">Type</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">Size</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500">Date</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        {asset.mime_type.startsWith('image/') ? (
                          <img src={asset.url_path} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><FileText size={14} className="text-gray-400" /></div>
                        )}
                        <span className="text-xs text-gray-900 truncate max-w-[200px]">{asset.original_name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-500">{asset.mime_type.split('/')[1]}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-500">{formatSize(asset.size_bytes)}</td>
                    <td className="py-2.5 px-4 text-xs text-gray-500">{new Date(asset.created_at).toLocaleDateString()}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleCopyUrl(asset.url_path) }} className="p-1 text-gray-400 hover:text-gray-600"><Copy size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedAsset(asset); setShowDeleteModal(true) }} className="p-1 text-gray-400 hover:text-danger ml-1"><Trash2 size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      <Modal isOpen={!!selectedAsset && !showDeleteModal} onClose={() => setSelectedAsset(null)} title={selectedAsset?.original_name || ''} size="lg">
        {selectedAsset && (
          <div className="space-y-4">
            {selectedAsset.mime_type.startsWith('image/') ? (
              <img src={selectedAsset.url_path} alt={selectedAsset.original_name} className="w-full max-h-[50vh] object-contain rounded-lg bg-gray-50" />
            ) : (
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <FileText size={48} className="text-gray-300" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-gray-400">Name:</span> <span className="text-gray-700">{selectedAsset.original_name}</span></div>
              <div><span className="text-gray-400">Size:</span> <span className="text-gray-700">{formatSize(selectedAsset.size_bytes)}</span></div>
              <div><span className="text-gray-400">Type:</span> <span className="text-gray-700">{selectedAsset.mime_type}</span></div>
              <div><span className="text-gray-400">Uploaded:</span> <span className="text-gray-700">{new Date(selectedAsset.created_at).toLocaleDateString()}</span></div>
            </div>
            <div className="flex gap-2">
              <input readOnly value={window.location.origin + selectedAsset.url_path} className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600" />
              <Button variant="outline" size="sm" onClick={() => handleCopyUrl(selectedAsset.url_path)}>
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={12} /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedAsset(null) }} title="Delete asset" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Delete <strong>{selectedAsset?.original_name}</strong> permanently?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
