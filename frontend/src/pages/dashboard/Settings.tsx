import { useState, useEffect } from 'react'
import PageMeta from '../../components/PageMeta'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { useAuth } from '../../context/AuthContext'
import { User, Lock, Trash2, Download, Bell, Shield, Check } from 'lucide-react'
import api from '../../lib/api'
import { isValidPassword } from '../../lib/validate'

type Tab = 'profile' | 'security' | 'notifications'

interface UserProfile {
  id: string
  name: string
  email: string
  plan: string
  status: string
  email_verified: boolean
  created_at: string
  last_login: string | null
  deletion_scheduled_at: string | null
}

export default function Settings() {
  const { user, setUser } = useAuth()
  const [tab, setTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile
  const [name, setName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')

  // Password
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [savingPw, setSavingPw] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError] = useState('')

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get<{ data: UserProfile }>('/settings/profile')
      setProfile(res.data.data)
      setName(res.data.data.name || '')
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  // Profile save
  const handleSaveProfile = async () => {
    if (!name.trim()) return
    setSavingProfile(true)
    setProfileSuccess('')
    try {
      await api.put('/settings/profile', { name: name.trim() })
      setProfileSuccess('Profile updated')
      if (profile) setProfile({ ...profile, name: name.trim() })
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err: any) {
      // ignore
    } finally {
      setSavingProfile(false)
    }
  }

  // Password change
  const handleChangePassword = async () => {
    setPwErrors({})
    setPwError('')
    setPwSuccess('')

    if (!currentPw) { setPwErrors({ current: 'Current password is required' }); return }
    const check = isValidPassword(newPw)
    if (!check.valid) { setPwErrors({ new: check.errors[0] }); return }
    if (newPw !== confirmPw) { setPwErrors({ confirm: 'Passwords do not match' }); return }

    setSavingPw(true)
    try {
      await api.put('/settings/password', { currentPassword: currentPw, newPassword: newPw })
      setPwSuccess('Password updated. You may need to log in again.')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => setPwSuccess(''), 5000)
    } catch (err: any) {
      setPwError(err.response?.data?.errors?.[0]?.message || 'Failed to change password')
    } finally {
      setSavingPw(false)
    }
  }

  // Account deletion
  const handleRequestDeletion = async () => {
    if (deleteConfirm !== 'DELETE') { setDeleteError('Type DELETE to confirm'); return }
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await api.post<{ data: { scheduledAt: string } }>('/settings/delete', { confirmation: 'DELETE' })
      setShowDeleteModal(false)
      if (profile) {
        setProfile({ ...profile, status: 'pending_deletion', deletion_scheduled_at: res.data.data.scheduledAt })
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.errors?.[0]?.message || 'Failed to request deletion')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDeletion = async () => {
    try {
      await api.post('/settings/cancel-deletion')
      if (profile) setProfile({ ...profile, status: 'active', deletion_scheduled_at: null })
    } catch {
      // ignore
    }
  }

  const handleExportData = async () => {
    try {
      const res = await api.post('/settings/export', {}, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `vallixis-export-${new Date().toISOString().slice(0,10)}.json`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Profile', icon: <User size={16} /> },
    { key: 'security', label: 'Security', icon: <Shield size={16} /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ]

  return (
    <>
      <PageMeta title="Settings" />
      <div className="max-w-3xl space-y-6">
        <h1 className="text-heading-md text-gray-900">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Deletion notice */}
        {profile?.deletion_scheduled_at && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              Your account is scheduled for deletion on{' '}
              <strong>{new Date(profile.deletion_scheduled_at).toLocaleDateString()}</strong>.
            </p>
            <button onClick={handleCancelDeletion} className="text-sm text-primary font-medium mt-2 hover:underline">
              Cancel deletion
            </button>
          </div>
        )}

        {loading ? (
          <div className="card p-12 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* Profile Tab */}
            {tab === 'profile' && (
              <div className="space-y-6">
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={18} className="text-primary" />
                    <h3 className="text-heading-sm text-gray-900">Profile</h3>
                  </div>

                  {profileSuccess && (
                    <div className="bg-green-50 border border-success/20 text-success text-sm px-4 py-2 rounded-md mb-4 flex items-center gap-2">
                      <Check size={14} /> {profileSuccess}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      label="Display name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                    <Input
                      label="Email address"
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      hint={profile?.email_verified ? 'Verified' : 'Not verified'}
                    />
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Plan: <strong className="text-gray-700 capitalize">{profile?.plan || 'Free'}</strong></span>
                      <span>Joined: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</span>
                    </div>
                    <Button variant="primary" size="sm" loading={savingProfile} onClick={handleSaveProfile}>
                      Save changes
                    </Button>
                  </div>
                </div>

                {/* Export data */}
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Download size={18} className="text-primary" />
                    <h3 className="text-heading-sm text-gray-900">Export data</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Download a copy of all your data including sites, invoices, and account info.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    Export as JSON
                  </Button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {tab === 'security' && (
              <div className="space-y-6">
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={18} className="text-primary" />
                    <h3 className="text-heading-sm text-gray-900">Change password</h3>
                  </div>

                  {pwSuccess && (
                    <div className="bg-green-50 border border-success/20 text-success text-sm px-4 py-2 rounded-md mb-4 flex items-center gap-2">
                      <Check size={14} /> {pwSuccess}
                    </div>
                  )}
                  {pwError && (
                    <div className="bg-red-50 border border-danger/20 text-danger text-sm px-4 py-2 rounded-md mb-4">
                      {pwError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Input
                      label="Current password"
                      type="password"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="••••••••"
                      error={pwErrors.current}
                    />
                    <Input
                      label="New password"
                      type="password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      error={pwErrors.new}
                      hint="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                    />
                    <Input
                      label="Confirm new password"
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="Repeat new password"
                      error={pwErrors.confirm}
                    />
                    <Button variant="outline" size="sm" loading={savingPw} onClick={handleChangePassword}>
                      Update password
                    </Button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="card p-5 border-2 border-danger/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Trash2 size={18} className="text-danger" />
                    <h3 className="text-heading-sm text-gray-900">Danger zone</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Deleting your account will remove all your sites and data. This cannot be undone. You have a 30-day grace period to cancel.
                  </p>
                  <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                    Request account deletion
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {tab === 'notifications' && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Bell size={18} className="text-primary" />
                  <h3 className="text-heading-sm text-gray-900">Email notifications</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Site deployed', desc: 'When your site goes live', defaultOn: true },
                    { label: 'Payment receipts', desc: 'Monthly invoice and payment confirmations', defaultOn: true },
                    { label: 'Security alerts', desc: 'Login attempts and password changes', defaultOn: true },
                    { label: 'Weekly digest', desc: 'Summary of your site performance', defaultOn: false },
                    { label: 'Product updates', desc: 'New features and improvements', defaultOn: false },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultOn}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">Notification preferences are saved automatically.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteConfirm(''); setDeleteError('') }}
        title="Delete account"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will schedule your account for deletion in 30 days. All your sites will be taken offline.
          </p>
          <p className="text-sm text-gray-600">
            Type <strong>DELETE</strong> to confirm:
          </p>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
          />
          {deleteError && (
            <p className="text-xs text-danger">{deleteError}</p>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleRequestDeletion}>
              Delete account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
