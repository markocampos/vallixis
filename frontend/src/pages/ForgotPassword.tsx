import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import Input from '../components/Input'
import { APP_NAME } from '../lib/constants'
import LogoIcon from '../components/LogoIcon'
import api from '../lib/api'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email'); return }

    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta title="Forgot password" description={`Reset your ${APP_NAME} password.`} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary mb-6">
              <LogoIcon className="w-9 h-9" />
              {APP_NAME}
            </Link>
            <h1 className="text-heading-md text-gray-900">Forgot your password?</h1>
            <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send you a reset link.</p>
          </div>

          {sent ? (
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-success" />
              </div>
              <h2 className="text-heading-sm text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">
                We've sent a password reset link to <span className="font-medium text-gray-700">{email}</span>.
                The link expires in 1 hour.
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="btn-outline w-full"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-danger/20 text-danger text-sm px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <Mail size={16} />
                    Send reset link
                  </span>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
