import { Link } from 'react-router-dom'
import { APP_NAME } from '../lib/constants'
import LogoIcon from './LogoIcon'

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white mb-3">
              <LogoIcon className="w-8 h-8" />
              {APP_NAME}
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Managed website hosting for solo entrepreneurs. Get live in minutes.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/templates" className="text-sm text-gray-400 hover:text-white transition-colors">Templates</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/wizard-demo" className="text-sm text-gray-400 hover:text-white transition-colors">Try Demo</Link></li>
              <li><Link to="/roadmap" className="text-sm text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/manifesto" className="text-sm text-gray-400 hover:text-white transition-colors">Manifesto</Link></li>
              <li><Link to="/support" className="text-sm text-gray-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/forum" className="text-sm text-gray-400 hover:text-white transition-colors">Forum</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cancellation" className="text-sm text-gray-400 hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-xs text-gray-500">Made with ❤️ in the Philippines 🇵🇭</p>
        </div>
      </div>
    </footer>
  )
}
