import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { getAdminUser } from './api/adminClient'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange'
import VisitorCounter from './components/VisitorCounter'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'

const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage'))
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminActivitiesPage = lazy(() => import('./pages/admin/AdminActivitiesPage'))
const AdminOpportunitiesPage = lazy(() => import('./pages/admin/AdminOpportunitiesPage'))
const AdminOpportunityDetailPage = lazy(() => import('./pages/admin/AdminOpportunityDetailPage'))
const AdminPostsPage = lazy(() => import('./pages/admin/AdminPostsPage'))
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'))
const AdminVerifyOtpPage = lazy(() => import('./pages/admin/AdminVerifyOtpPage'))
const ActualitesPage = lazy(() => import('./pages/ActualitesPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'))
const OpportunityDetailPage = lazy(() => import('./pages/OpportunityDetailPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))

function RouteFallback() {
  return <div className="min-h-[40vh] bg-white" />
}

function AdminHomeRedirect() {
  const role = getAdminUser()?.role?.name

  if (role === 'manager') {
    return <Navigate to="/admin/opportunities" replace />
  }

  return <AdminOverviewPage />
}

function App() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <VisitorCounter />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/verify-otp" element={<AdminVerifyOtpPage />} />

          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminHomeRedirect />} />
              <Route path="opportunities" element={<AdminOpportunitiesPage />} />
              <Route path="opportunities/:id" element={<AdminOpportunityDetailPage />} />

              <Route element={<ProtectedAdminRoute allowedRoles={['admin']} />}>
                <Route path="posts" element={<AdminPostsPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route path="activities" element={<AdminActivitiesPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
            <Route path="/actualites" element={<ActualitesPage />} />
            <Route path="/actualites/articles" element={<Navigate to="/actualites" replace />} />
            <Route path="/actualites/communiques" element={<Navigate to="/actualites" replace />} />
            <Route path="/actualites/:slug" element={<PostDetailPage />} />
            <Route path="/galerie" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
