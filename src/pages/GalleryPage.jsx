import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionContainer from '../components/SectionContainer'

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
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState(null)

  return (
    <>
      {/* Title */}
      <SectionContainer className="bg-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-extrabold text-primary-500 md:text-5xl">
            {t('galleryTitle')}
          </h1>
        </div>
      </SectionContainer>

      {/* Introduction */}
      <SectionContainer className="bg-white">
        <div className="mx-auto max-w-6xl">
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
        </div>
      </SectionContainer>

      {/* Photo grid */}
      <SectionContainer className="bg-white pt-2">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setLightbox(img)}
                className="group overflow-hidden rounded-xl border border-primary-100 bg-primary-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56"
                />
              </button>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
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
          </div>
        </div>
      )}
    </>
  )
}
