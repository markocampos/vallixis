import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Globe, PlusCircle, BarChart2, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/dashboard/sites', icon: Globe, label: 'Sites' },
  { to: '/dashboard/wizard', icon: PlusCircle, label: 'New', isAction: true },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Stats' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, icon: Icon, label, end, isAction }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isAction
                  ? 'text-primary'
                  : isActive
                    ? 'text-primary'
                    : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isAction ? (
                  <div className={`w-11 h-11 -mt-5 rounded-full flex items-center justify-center shadow-md transition-colors ${
                    isActive ? 'bg-primary' : 'bg-primary hover:bg-primary-hover'
                  }`}>
                    <Icon size={22} className="text-white" />
                  </div>
                ) : (
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                )}
                <span className={`text-[10px] font-medium ${isAction ? 'mt-0.5' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
