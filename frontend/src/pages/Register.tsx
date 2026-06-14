import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import PageMeta from '../components/PageMeta'
import Input from '../components/Input'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import { isValidEmail, isValidPassword } from '../lib/validate'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { APP_NAME } from '../lib/constants'
import LogoIcon from '../components/LogoIcon'

export default function Register() {
  const navigate = useNavigate()
    const { setUser } = useAuthStore()

  const [form, setForm] = useState({ name: '', email: '', password: '', agree: false, turnstileToken: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!isValidEmail(form.email)) errs.email = 'Valid email required'
    const pwCheck = isValidPassword(form.password)
    if (!pwCheck.valid) errs.password = pwCheck.errors[0]
    if (!form.agree) errs.agree = 'You must agree to the terms'
    if (!form.turnstileToken) errs.turnstileToken = 'Please complete the security check'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      const res = await api.post<{ data: { id: string; email: string; name: string | null; plan: string; role: string } }>('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        turnstileToken: form.turnstileToken
      })
      setUser(res.data.data)
      navigate('/dashboard')
    } catch (err: any) {
      setApiError(err.response?.data?.errors?.[0]?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta title="Create account" description={`Join ${APP_NAME} and get your business online in minutes.`} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary mb-6">
              <LogoIcon className="w-9 h-9" />
              {APP_NAME}
            </Link>
            <h1 className="text-heading-md text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-2">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            {apiError && (
              <div className="bg-red-50 border border-danger/20 text-danger text-sm px-4 py-3 rounded-md">
                {apiError}
              </div>
            )}

            <Input
              label="Full name"
              placeholder="Maria Santos"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              required
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              hint="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
              required
            />
            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              error={errors.agree}
            />

            <div className="flex justify-center my-4">
              <Turnstile 
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ''} 
                onSuccess={(token) => setForm({ ...form, turnstileToken: token })}
                onError={() => setForm({ ...form, turnstileToken: '' })}
                onExpire={() => setForm({ ...form, turnstileToken: '' })}
              />
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
