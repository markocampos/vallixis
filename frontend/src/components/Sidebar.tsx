import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Globe, BarChart2, CreditCard, Settings, Image, LifeBuoy, PlusCircle } from 'lucide-react'
import { APP_NAME } from '../lib/constants'
import LogoIcon from './LogoIcon'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/sites', icon: Globe, label: 'My Sites' },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { to: '/dashboard/assets', icon: Image, label: 'Assets' },
  { to: '/dashboard/support', icon: LifeBuoy, label: 'Support' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <LogoIcon className="w-7 h-7" />
          {APP_NAME}
        </Link>
      </div>

      {/* New site CTA */}
      <div className="p-4">
        <Link to="/dashboard/wizard" className="btn-primary w-full text-center gap-2">
          <PlusCircle size={16} />
          New Site
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
