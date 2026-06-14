import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <PageMeta title="Page not found" />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-primary">4</span>
            <span className="text-3xl font-bold text-primary">0</span>
            <span className="text-3xl font-bold text-primary">4</span>
          </div>
          <h1 className="text-heading-lg text-gray-900 mb-3">Page not found</h1>
          <p className="text-body-md text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary gap-2">
            <Home size={18} />
            Go home
          </Link>
        </div>
      </div>
    </>
  )
}
