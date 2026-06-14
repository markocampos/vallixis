import React, { useState } from 'react'
import PageMeta from '../../components/PageMeta'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { User, Lock, Trash2 } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  return (
    <>
      <PageMeta title="Settings" />
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-heading-md text-gray-900">Account Settings</h1>

        {/* Profile */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-primary" />
            <h3 className="text-heading-sm text-gray-900">Profile</h3>
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Button variant="primary" size="sm">Save changes</Button>
          </div>
        </div>

        {/* Password */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-primary" />
            <h3 className="text-heading-sm text-gray-900">Change password</h3>
          </div>
          <div className="space-y-4">
            <Input label="Current password" type="password" placeholder="••••••••" />
            <Input label="New password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" />
            <Button variant="outline" size="sm">Update password</Button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card p-5 border-danger/30">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={18} className="text-danger" />
            <h3 className="text-heading-sm text-gray-900">Danger zone</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Deleting your account will remove all your sites and data. This cannot be undone.
          </p>
          <Button variant="danger" size="sm">Request account deletion</Button>
        </div>
      </div>
    </>
  )
}
