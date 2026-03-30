import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionContainer from '../components/SectionContainer'
import { fadeLeft, fadeUp, inViewViewport, staggerContainer } from '../utils/animations'

// Add or remove images here — place files in the /public folder and reference them as '/filename.jpg'
const images = [
  { src: '/riad_tanga_lug.jpeg',   alt: 'Raid Tanja Lagouira' },
  { src: '/riad_tanga_lug_2.jpeg', alt: 'Raid Tanja Lagouira' },
  { src: '/la_cope.jpeg',          alt: 'La Cope' },
  { src: '/riad_tanga_lug.jpeg',   alt: 'Raid Tanja Lagouira' },
  { src: '/riad_tanga_lug_2.jpeg', alt: 'Raid Tanja Lagouira' },
  { src: '/la_cope.jpeg',          alt: 'La Cope' },
  { src: '/riad_tanga_lug_2.jpeg', alt: 'Raid Tanja Lagouira' },
]

export default function GalleryPage() {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1

  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState(null)

  return (
    <>
      {/* Title */}
      <SectionContainer className="bg-white">
        <MotionDiv className="mx-auto max-w-6xl" variants={fadeUp} initial="hidden" animate="visible">
          <MotionH1 className="text-4xl font-extrabold text-primary-500 md:text-5xl" variants={fadeLeft}>
            {t('galleryTitle')}
          </MotionH1>
        </MotionDiv>
      </SectionContainer>

      {/* Introduction */}
      <SectionContainer className="bg-white">
        <MotionDiv className="mx-auto max-w-6xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
          <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-base leading-7 text-primary-400 md:text-lg">
              {t('galleryIntro1')}
            </p>
            <p className="mt-3 text-base leading-7 text-primary-400 md:text-lg">
              {t('galleryIntro2')}
            </p>
            <p className="mt-3 text-base leading-7 text-primary-400 md:text-lg">
              {t('galleryIntro3')}
            </p>
          </div>
        </MotionDiv>
      </SectionContainer>

      {/* Photo grid */}
      <SectionContainer className="bg-white pt-2">
        <MotionDiv className="mx-auto max-w-6xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
          <motion.div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={inViewViewport}>
            {images.map((img, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => setLightbox(img)}
                className="group overflow-hidden rounded-xl border border-primary-100 bg-primary-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
                variants={fadeUp}
                whileHover={{ scale: 1.03, boxShadow: '0 14px 30px rgba(20, 20, 20, 0.12)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56"
                />
              </motion.button>
            ))}
          </motion.div>
        </MotionDiv>
      </SectionContainer>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="relative max-h-[90vh] max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-500 shadow-lg hover:bg-primary-50"
              aria-label="Fermer"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
