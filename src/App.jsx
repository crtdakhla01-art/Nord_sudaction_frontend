import { Navigate, Route, Routes } from 'react-router-dom'
import { getAdminUser } from './api/adminClient'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminActivitiesPage from './pages/admin/AdminActivitiesPage'
import AdminOpportunitiesPage from './pages/admin/AdminOpportunitiesPage'
import AdminOpportunityDetailPage from './pages/admin/AdminOpportunityDetailPage'
import AdminPostsPage from './pages/admin/AdminPostsPage'
import AdminOverviewPage from './pages/admin/AdminOverviewPage'
import AdminVerifyOtpPage from './pages/admin/AdminVerifyOtpPage'
import ActualitesPage from './pages/ActualitesPage'
import AboutPage from './pages/AboutPage'
import ActivitiesPage from './pages/ActivitiesPage'
import ContactPage from './pages/ContactPage'
import EventDetailPage from './pages/EventDetailPage'
import EventsPage from './pages/EventsPage'
import HomePage from './pages/HomePage'
import OpportunitiesPage from './pages/OpportunitiesPage'
import OpportunityDetailPage from './pages/OpportunityDetailPage'
import GalleryPage from './pages/GalleryPage'
import PostDetailPage from './pages/PostDetailPage'

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
            </Route>
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
          <Route path="/actualites/articles" element={<ActualitesPage forcedType="article" />} />
          <Route path="/actualites/communiques" element={<ActualitesPage forcedType="communique" />} />
          <Route path="/actualites/media" element={<ActualitesPage forcedType="media" />} />
          <Route path="/actualites/:slug" element={<PostDetailPage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
