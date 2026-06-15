import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import Input from '../components/Input'
import { APP_NAME } from '../lib/constants'
import LogoIcon from '../components/LogoIcon'
import api from '../lib/api'
import { isValidPassword } from '../lib/validate'
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <>
        <PageMeta title="Invalid reset link" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="card p-8 text-center max-w-md">
            <h2 className="text-heading-sm text-gray-900 mb-2">Invalid reset link</h2>
            <p className="text-sm text-gray-500 mb-4">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="btn-primary">Request a new link</Link>
          </div>
        </div>
      </>
    )
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    const pwCheck = isValidPassword(password)
    if (!pwCheck.valid) errs.password = pwCheck.errors[0]
    if (password !== confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setLoading(true)
    setError('')
    setFieldErrors({})
    try {
      await api.post('/auth/reset-password', { token, password })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta title="Reset password" description={`Set a new password for your ${APP_NAME} account.`} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary mb-6">
              <LogoIcon className="w-9 h-9" />
              {APP_NAME}
            </Link>
            <h1 className="text-heading-md text-gray-900">Set new password</h1>
            <p className="text-sm text-gray-500 mt-2">Choose a strong password for your account.</p>
          </div>

          {success ? (
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-success" />
              </div>
              <h2 className="text-heading-sm text-gray-900 mb-2">Password updated</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full"
              >
                Go to login
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
                label="New password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                hint="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                required
              />

              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={fieldErrors.confirm}
                required
              />

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <Lock size={16} />
                    Reset password
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
