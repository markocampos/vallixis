import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import DashboardLayout from './components/DashboardLayout'
import PublicRoute from './components/guards/PublicRoute'
import ProtectedRoute from './components/guards/ProtectedRoute'

import ScrollToTop from './components/ScrollToTop'

// Public pages
import Home from './pages/Home'
import Templates from './pages/Templates'
import Pricing from './pages/Pricing'
import Support from './pages/Support'
import Business from './pages/Business'
import About from './pages/About'
import Manifesto from './pages/Manifesto'
import Roadmap from './pages/Roadmap'
import Forum from './pages/Forum'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import WizardDemo from './pages/WizardDemo'
import SitePreview from './pages/Preview'
import NotFound from './pages/NotFound'

// Legal pages
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import Cancellation from './pages/legal/Cancellation'

// Dashboard pages
import DashboardOverview from './pages/dashboard/DashboardOverview'
import WizardReal from './pages/dashboard/WizardReal'
import SitesList from './pages/dashboard/SitesList'
import SiteEditor from './pages/dashboard/SiteEditor'
import Analytics from './pages/dashboard/Analytics'
import Billing from './pages/dashboard/Billing'
import Settings from './pages/dashboard/Settings'
import Assets from './pages/dashboard/Assets'
import DashboardSupport from './pages/dashboard/DashboardSupport'
import Upgrade from './pages/dashboard/Upgrade'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/support" element={<Support />} />
                <Route path="/business" element={<Business />} />
                <Route path="/about" element={<About />} />
                <Route path="/manifesto" element={<Manifesto />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/wizard-demo" element={<WizardDemo />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cancellation" element={<Cancellation />} />
              </Route>

              {/* Preview route (no layout wrapper) */}
              <Route path="/preview/:slug" element={<SitePreview />} />

              {/* Auth routes (redirect if logged in) */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

              {/* Dashboard routes (require auth) */}
              <Route
                path="/dashboard"
                element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
              >
                <Route index element={<DashboardOverview />} />
                <Route path="wizard" element={<WizardReal />} />
                <Route path="sites" element={<SitesList />} />
                <Route path="sites/:id/edit" element={<SiteEditor />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
                <Route path="assets" element={<Assets />} />
                <Route path="support" element={<DashboardSupport />} />
                <Route path="upgrade" element={<Upgrade />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
