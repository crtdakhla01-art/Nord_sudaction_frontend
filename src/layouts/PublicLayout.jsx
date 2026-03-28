import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(167,243,208,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(186,230,253,0.35),_transparent_40%),#f8fbfa] text-slate-900">
      <Navbar />
      <main className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
