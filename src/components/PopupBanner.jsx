import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function PopupBanner() {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const isAdminRoute = pathname.startsWith('/admin')

  useEffect(() => {
    if (isAdminRoute) {
      return
    }

    // Show popup after a short delay when component mounts
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [isAdminRoute])

  const handleNavigate = () => {
    window.open('https://www.linkedin.com/company/association-nord-sud-action/', '_blank')
  }

  return (
    <AnimatePresence>
      {!isAdminRoute && isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-md w-full pointer-events-auto"
          >
            {/* Popup Image - Clickable */}
            <motion.div
              onClick={handleNavigate}
              className="relative cursor-pointer rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src="/popup.jpeg"
                alt="Nord Sud Action - LinkedIn"
                className="w-full h-auto object-cover"
                loading="eager"
                decoding="async"
                width="960"
                height="960"
              />
              {/* Close Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors z-10"
                aria-label="Close popup"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
