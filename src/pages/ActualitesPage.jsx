import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { getImageUrl } from '../api/client'
import { usePosts } from '../hooks/usePosts'
import { formatDateLabel } from '../utils/date'
import { fadeLeft, fadeUp, staggerContainer } from '../utils/animations'
import { useTranslation } from 'react-i18next'

function ActualitesPage() {
  const { t } = useTranslation()
  const MotionDiv = motion.div
  const MotionH1 = motion.h1
  const MotionArticle = motion.article

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const params = useMemo(
    () => ({
      page,
      per_page: 16,
      search: debouncedSearch || undefined,
    }),
    [page, debouncedSearch],
  )

  const { data, isLoading, isError, error } = usePosts(params)

  const posts = data?.data || []
  const currentPage = data?.current_page || 1
  const lastPage = data?.last_page || 1
  const totalPosts = data?.total || 0
  const shouldPaginate = totalPosts > 16
  const featured = posts.find((item) => item.is_featured)

  const pageTitle = 'Actualités'

  return (
    <SectionContainer>
      <MotionDiv
        className="mx-auto w-full max-w-6xl space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <MotionDiv className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between" variants={fadeUp}>
          <div>
            <MotionH1 className="mt-2 text-4xl font-extrabold text-primary-500 md:text-5xl" variants={fadeLeft}>{pageTitle}</MotionH1>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search by title..."
            className="w-full rounded-xl border border-secondary-100 bg-primary-50 px-4 py-2.5 text-sm text-primary-500 shadow-sm outline-none transition focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20 md:max-w-xs"
          />
        </MotionDiv>

        {featured ? (
          <MotionArticle className="overflow-hidden rounded-3xl border border-secondary-100 bg-primary-50 shadow-md" variants={fadeUp} whileHover={{ scale: 1.01 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
              <div className="h-72 md:h-full">
                {featured.image ? (
                  <img src={getImageUrl(featured.image)} alt={featured.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-primary-50">
                    <span className="text-4xl font-black text-secondary-500 opacity-20">NSA</span>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-500">Featured</p>
                <h2 className="mt-3 text-2xl font-black text-primary-500">{featured.title}</h2>
                {featured.description ? (
                  <p className="mt-3 text-sm leading-7 text-primary-400">{featured.description}</p>
                ) : null}
                <p className="mt-3 text-xs font-semibold uppercase text-primary-400">{formatDateLabel(featured.published_at || featured.created_at, 'fr')}</p>
                <Link to={`/actualites/${featured.slug}`} className="mt-5 inline-flex cursor-pointer rounded-lg bg-secondary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-600 active:scale-95">
                  {t('readMore')}
                </Link>
              </div>
            </div>
          </MotionArticle>
        ) : null}

        {isLoading ? <LoadingState /> : null}
        {isError ? <ErrorState message={error?.message} error={error} /> : null}

        {!isLoading && !isError ? (
          <>
            <MotionDiv className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
              {posts.map((post) => (
                <motion.div key={post.id} variants={fadeUp} whileHover={{ scale: 1.03, boxShadow: '0 16px 36px rgba(20, 20, 20, 0.12)' }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                  <Link
                    to={`/actualites/${post.slug}`}
                    className="group interactive-card flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-100 bg-primary-50 shadow-sm transition-all duration-300"
                  >
                    <div className="w-full flex-shrink-0 overflow-hidden">
                      {post.media ? (
                        /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(post.media) ? (
                          <video src={getImageUrl(post.media)} className="w-full md:h-32 md:object-cover" muted />
                        ) : (
                          <img src={getImageUrl(post.media)} alt={post.title} className="w-full transition duration-500 group-hover:scale-105 md:h-32 md:object-cover" loading="lazy" decoding="async" />
                        )
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center">
                          <span className="text-4xl font-black text-secondary-500 opacity-20">NSA</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-2 p-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-primary-500 line-clamp-2">{post.title}</h3>
                        {post.description ? <p className="line-clamp-2 text-xs text-primary-400">{post.description}</p> : null}
                        <p className="text-xs font-semibold uppercase text-primary-400">{formatDateLabel(post.published_at || post.created_at, 'fr')}</p>
                      </div>
                      <button
                        type="button"
                        className="mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-secondary-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:bg-accent-500 hover:shadow-lg hover:shadow-secondary-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-2"
                      >
                        {t('readMore')}
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </MotionDiv>

            {posts.length === 0 ? (
              <p className="rounded-2xl border border-secondary-100 bg-primary-50 px-4 py-5 text-sm text-primary-400 shadow-md">
                No posts found.
              </p>
            ) : null}

            {shouldPaginate ? (
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                  className="cursor-pointer rounded-lg border border-secondary-100 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs font-semibold text-primary-400">{currentPage} / {lastPage}</span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                  disabled={currentPage >= lastPage}
                  className="cursor-pointer rounded-lg border border-secondary-100 px-3 py-1.5 text-xs font-semibold text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </MotionDiv>
    </SectionContainer>
  )
}

export default ActualitesPage
