export default function VideoPlayer({ url }) {
  // Convert any YouTube URL format to an embed URL
  const getEmbedUrl = (rawUrl) => {
    try {
      const parsed = new URL(rawUrl)
      let videoId = null
      if (parsed.hostname === 'youtu.be') {
        videoId = parsed.pathname.slice(1)
      } else {
        videoId = parsed.searchParams.get('v')
      }
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
        : null
    } catch {
      return null
    }
  }

  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) return null

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-lg">
      {/* 16:9 aspect-ratio wrapper */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 h-full w-full rounded-2xl"
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
