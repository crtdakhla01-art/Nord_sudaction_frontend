import { useEffect, useMemo, useState } from 'react'
import { getImageUrl } from '../api/client'

const isAdActiveNow = (ad, nowDate) => {
  const begin = new Date(ad.begin_date)
  const end = new Date(ad.end_date)

  if (Number.isNaN(begin.getTime()) || Number.isNaN(end.getTime())) {
    return false
  }

  begin.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return begin <= nowDate && nowDate <= end
}

function AdvertisementsTable({ advertisements = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const activeAds = useMemo(() => {
    const nowDate = new Date()
    return advertisements.filter((ad) => isAdActiveNow(ad, nowDate))
  }, [advertisements])

  const displayAds = activeAds.length > 0 ? activeAds : advertisements

  useEffect(() => {
    setCurrentIndex(0)
  }, [displayAds.length])

  useEffect(() => {
    if (displayAds.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayAds.length)
    }, 4500)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [displayAds.length])

  if (displayAds.length === 0) {
    return null
  }

  const hasSlider = displayAds.length > 1
  const currentAd = displayAds[currentIndex] || displayAds[0]

  const clickable = Boolean(currentAd.link)

  const imageNode = (
    <img
      src={getImageUrl(currentAd.image)}
      alt="Advertisement"
      className={`h-24 w-full object-cover sm:h-28 md:h-32 transition-all duration-300 ${
        clickable ? 'cursor-pointer group-hover:scale-[1.03]' : ''
      }`}
    />
  )

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + displayAds.length) % displayAds.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayAds.length)
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <article
        className={`group relative overflow-hidden rounded-[8px] border bg-white p-2 shadow-sm transition-all duration-300 ${
          clickable ? 'border-[#4F46E5]/55 hover:shadow-lg hover:shadow-[#4F46E5]/20' : 'border-primary-100'
        }`}
      >
        {clickable ? (
          <a href={currentAd.link} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[6px]">
            {imageNode}
          </a>
        ) : (
          <div className="overflow-hidden rounded-[6px]">{imageNode}</div>
        )}

        {hasSlider ? (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous advertisement"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-2 py-1 text-sm text-white transition hover:bg-black/60"
            >
              {'<'}
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next advertisement"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-2 py-1 text-sm text-white transition hover:bg-black/60"
            >
              {'>'}
            </button>

            <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {displayAds.map((ad, index) => (
                <button
                  key={ad.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to advertisement ${index + 1}`}
                  className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition ${
                    currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </article>
    </div>
  )
}

export default AdvertisementsTable
