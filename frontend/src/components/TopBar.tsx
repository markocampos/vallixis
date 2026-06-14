import { Bell, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-gray-900">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name ? user.name[0].toUpperCase() : <User size={14} />}
          </div>
          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-primary transition-colors font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
