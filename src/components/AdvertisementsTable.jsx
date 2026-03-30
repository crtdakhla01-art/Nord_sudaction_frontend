import { useMemo } from 'react'
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
  const activeAds = useMemo(() => {
    const nowDate = new Date()
    return advertisements.filter((ad) => isAdActiveNow(ad, nowDate))
  }, [advertisements])

  const displayAds = activeAds.length > 0 ? activeAds : advertisements

  if (displayAds.length === 0) {
    return null
  }

  const currentAd = displayAds[0]

  const clickable = Boolean(currentAd.link)

  const imageNode = (
    <img
      src={getImageUrl(currentAd.image)}
      alt="Advertisement"
      className={`h-[120px] w-full rounded-lg object-cover sm:h-[150px] md:h-[190px] transition-all duration-300 ${
        clickable ? 'cursor-pointer group-hover:scale-[1.03]' : ''
      }`}
    />
  )

  return (
    <div className="w-full">
      <article
        className="group relative w-full overflow-hidden rounded-[8px] bg-transparent transition-all duration-300"
      >
        {clickable ? (
          <a href={currentAd.link} target="_blank" rel="noreferrer" className="block w-full overflow-hidden rounded-[6px]">
            {imageNode}
          </a>
        ) : (
          <div className="w-full overflow-hidden rounded-[6px]">{imageNode}</div>
        )}
      </article>
    </div>
  )
}

export default AdvertisementsTable
