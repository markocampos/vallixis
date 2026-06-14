import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../lib/constants'
import LogoIcon from './LogoIcon'

export default function PublicNav() {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-page flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <LogoIcon className="w-8 h-8" />
          {APP_NAME}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/templates" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            Templates
          </NavLink>
          <NavLink to="/pricing" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            Pricing
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
            Support
          </NavLink>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary btn-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <NavLink to="/templates" className="block text-sm font-medium text-gray-700 hover:text-primary py-2" onClick={() => setOpen(false)}>Templates</NavLink>
          <NavLink to="/pricing" className="block text-sm font-medium text-gray-700 hover:text-primary py-2" onClick={() => setOpen(false)}>Pricing</NavLink>
          <NavLink to="/support" className="block text-sm font-medium text-gray-700 hover:text-primary py-2" onClick={() => setOpen(false)}>Support</NavLink>
          <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-center" onClick={() => setOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-center" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
