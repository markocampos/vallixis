import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'
import PageMeta from '../components/PageMeta'
import Input from '../components/Input'
import Button from '../components/Button'
import api from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { APP_NAME } from '../lib/constants'
import LogoIcon from '../components/LogoIcon'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser } = useAuthStore()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const plan = searchParams.get('plan')

  const [form, setForm] = useState({ email: '', password: '', turnstileToken: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please enter your email and password'); return }
    if (!form.turnstileToken) { setError('Please complete the security check'); return }

    setLoading(true)
    setError('')
    try {
      const res = await api.post<{ data: { id: string; email: string; name: string | null; plan: string; role: string } }>('/auth/login', {
        email: form.email,
        password: form.password,
        turnstileToken: form.turnstileToken
      })
      setUser(res.data.data)
      if (plan && plan !== 'free') {
        navigate(`/dashboard/upgrade?plan=${plan}`)
      } else {
        navigate(redirect)
      }
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta title="Log in" description={`Log in to your ${APP_NAME} account.`} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary mb-6">
              <LogoIcon className="w-9 h-9" />
              {APP_NAME}
            </Link>
            <h1 className="text-heading-md text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-2">Log in to manage your sites</p>
          </div>

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
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <Turnstile 
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ''} 
                onSuccess={(token) => setForm({ ...form, turnstileToken: token })}
                onError={() => setForm({ ...form, turnstileToken: '' })}
                onExpire={() => setForm({ ...form, turnstileToken: '' })}
              />
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Log in
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to={plan ? `/register?plan=${plan}` : '/register'} className="text-primary font-medium hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </>
  )
}
