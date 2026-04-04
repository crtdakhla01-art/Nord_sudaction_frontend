import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import ErrorState from '../components/ErrorState'
import SectionContainer from '../components/SectionContainer'
import { fetchGalleryPage } from '../api/gallery'
import { fadeLeft, fadeUp, inViewViewport } from '../utils/animations'

const skeletonItems = Array.from({ length: 8 }, (_, index) => index)

const ImageCard = memo(function ImageCard({ img, onOpen }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(img)}
      className="group overflow-hidden rounded-xl border border-primary-100 bg-primary-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ scale: 1.03, boxShadow: '0 14px 30px rgba(20, 20, 20, 0.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {!loaded && (
        <div className="h-48 w-full animate-pulse bg-primary-100 sm:h-56" />
      )}
      <img
        src={img.thumb}
        alt={img.alt}
        loading="lazy"
        decoding="async"
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        onLoad={() => setLoaded(true)}
        className={`h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56 ${loaded ? '' : 'invisible absolute'}`}
      />
    </motion.button>
  )
})

export default function GalleryPage() {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1

  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['gallery'],
    queryFn: fetchGalleryPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 10 * 60 * 1000,
  })

  const images = data?.pages.flatMap((page) => page.images) ?? []
  const categoryNames = Array.from(new Set(images.map((img) => img.categoryName).filter(Boolean)))
  const categories = categoryNames.length > 0 ? ['all', ...categoryNames] : []
  const filteredImages =
    activeCategory === 'all' ? images : images.filter((img) => img.categoryName === activeCategory)

  const handleOpen = useCallback((img) => setLightbox(img), [])

  const sentinelRef = useRef(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '400px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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
          {isError ? <ErrorState message={error?.message || 'Failed to fetch gallery images.'} /> : null}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
              {skeletonItems.map((item) => (
                <div key={item} className="h-48 animate-pulse rounded-xl bg-primary-100 sm:h-56" />
              ))}
            </div>
          ) : null}

          {!isLoading && categories.length > 1 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeCategory === category
                      ? 'bg-secondary-500 text-white'
                      : 'border border-primary-200 bg-white text-primary-500 hover:bg-primary-50'
                  }`}
                >
                  {category === 'all' ? 'Toutes' : category}
                </button>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredImages.map((img) => (
              <ImageCard key={img.id ?? img.src} img={img} onOpen={handleOpen} />
            ))}
          </div>

          <div ref={sentinelRef} className="mt-4 flex justify-center py-4">
            {isFetchingNextPage ? (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-secondary-500" />
            ) : null}
          </div>
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
              src={lightbox.full}
              alt={lightbox.alt}
              decoding="async"
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
