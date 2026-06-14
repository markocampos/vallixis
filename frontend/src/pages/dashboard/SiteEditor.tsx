import { useParams } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import EditorPanel from '../../components/EditorPanel'
import PreviewFrame from '../../components/PreviewFrame'

export default function SiteEditor() {
  // const { id } = useParams<{ id: string }>()

  return (
    <>
      <PageMeta title="Site Editor" />
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-md text-gray-900">Site Editor</h1>
          <button className="btn-primary btn-sm">Save & Deploy</button>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
          <EditorPanel title="Site settings">
            <p className="text-sm text-gray-500">Site editor will be available in Phase 1. Use the wizard to create and update your site for now.</p>
          </EditorPanel>
          <PreviewFrame title="Site preview" className="h-full" />
        </div>
      </div>
    </>
  )
}
