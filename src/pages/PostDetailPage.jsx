import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { getImageUrl } from '../api/client'
import { usePosts } from '../hooks/usePosts'
import { formatDateLabel } from '../utils/date'
import { fadeLeft, fadeUp, staggerContainer } from '../utils/animations'

function SidebarWidget({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-secondary-500" />
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary-500">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function SidebarPost({ post }) {
  return (
    <Link to={`/actualites/${post.slug}`} className="group flex items-start gap-3 py-3 transition">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-primary-100 p-1 sm:h-14 sm:p-0">
        {post.media && !/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(post.media) ? (
          <img src={getImageUrl(post.media)} alt={post.title} className="h-full w-full object-contain transition duration-300 group-hover:scale-105 sm:object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] font-black text-secondary-500 opacity-40">NSA</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-primary-500 group-hover:text-secondary-500 transition-colors">{post.title}</p>
        <p className="mt-1 text-[11px] text-primary-300">{formatDateLabel(post.published_at || post.created_at, 'fr')}</p>
      </div>
    </Link>
  )
}

function PostDetailPage() {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1

  const { slug } = useParams()

  const { data, isLoading, isError, error } = usePosts()
  const posts = data?.data || []

  const post = posts.find((p) => p.slug === slug)
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3)
  const sidebarPosts = posts.filter((p) => p.slug !== slug).slice(0, 7)

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} | Nord Sud Action`
    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) descriptionMeta.setAttribute('content', post.description || '')
  }, [post])

  if (isLoading) return <SectionContainer><LoadingState /></SectionContainer>
  if (isError) return <SectionContainer><ErrorState message={error?.message} error={error} /></SectionContainer>
  if (!post) return <SectionContainer><ErrorState message="Article introuvable." /></SectionContainer>

  return (
    <SectionContainer>
      <MotionDiv
        className="mx-auto w-full max-w-7xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >

        {/* Back link */}
        <Link to="/actualites" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-500 transition hover:text-secondary-600">
          ← Retour aux actualités
        </Link>

        {/* 2-column layout */}
        <MotionDiv className="grid grid-cols-12 gap-6" variants={fadeUp}>

          {/* ── Main article — col-span-8 ── */}
          <main className="col-span-12 lg:col-span-8">
            <motion.article className="overflow-hidden rounded-xl bg-white shadow-md" variants={fadeUp}>

              {/* Hero image */}
              {post.media ? (
                <div className="h-72 w-full overflow-hidden bg-primary-100 p-3 sm:h-80 sm:bg-transparent sm:p-0 md:h-[420px]">
                  {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(post.media) ? (
                    <video src={getImageUrl(post.media)} className="h-full w-full object-contain sm:object-cover" controls />
                  ) : (
                    <img src={getImageUrl(post.media)} alt={post.title} className="h-full w-full object-contain sm:object-cover" loading="lazy" decoding="async" />
                  )}
                </div>
              ) : null}

              <div className="space-y-5 p-5 sm:p-7">

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-primary-400">{formatDateLabel(post.published_at || post.created_at, 'fr')}</span>
                </div>

                {/* Title */}
                <MotionH1 className="text-2xl font-extrabold leading-snug tracking-tight text-primary-500 md:text-3xl" variants={fadeLeft}>{post.title}</MotionH1>

                {/* Lead description */}
                {post.description ? (
                  <p className="border-l-4 border-secondary-500 pl-4 text-base font-medium leading-relaxed text-primary-400">{post.description}</p>
                ) : null}

                {/* Rich content */}
                {post.content ? (
                  <div
                    className="post-content prose max-w-none border-t border-primary-100 pt-5 prose-headings:text-primary-500 prose-p:leading-8 prose-p:text-primary-400 prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : null}

                {/* External link */}
                {post.external_link ? (
                  <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase text-primary-400">Source externe</p>
                    <a
                      href={post.external_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-secondary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500"
                    >
                      🔗 Ouvrir la source
                    </a>
                  </div>
                ) : null}
              </div>
            </motion.article>

            {/* Related posts */}
            {related.length > 0 ? (
              <section className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-secondary-500" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-primary-500">Articles liés</h2>
                </div>
                <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" variants={staggerContainer}>
                  {related.map((item) => (
                    <motion.div key={item.id} variants={fadeUp} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
                      <Link
                        to={`/actualites/${item.slug}`}
                        className="group interactive-card flex flex-col overflow-hidden rounded-xl bg-white shadow transition-all duration-300"
                      >
                      {item.media ? (
                        <div className="w-full overflow-hidden">
                          {/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(item.media) ? (
                            <video src={getImageUrl(item.media)} className="w-full md:h-40 md:object-cover" muted />
                          ) : (
                            <img src={getImageUrl(item.media)} alt={item.title} className="w-full transition duration-300 group-hover:scale-105 md:h-40 md:object-cover" loading="lazy" decoding="async" />
                          )}
                        </div>
                      ) : (
                        <div className="flex h-28 items-center justify-center bg-primary-50">
                          <span className="text-2xl font-black text-secondary-500 opacity-20">NSA</span>
                        </div>
                      )}
                      <div className="space-y-1 p-3">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-primary-500 group-hover:text-secondary-500 transition-colors">{item.title}</h3>
                        <p className="text-[11px] text-primary-300">{formatDateLabel(item.published_at || item.created_at, 'fr')}</p>
                      </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            ) : null}
          </main>

          {/* ── Sidebar — col-span-4 ── */}
          <aside className="col-span-12 space-y-5 lg:col-span-4">

            <SidebarWidget title="Autres actualités">
              {sidebarPosts.length > 0 ? (
                <div className="divide-y divide-primary-100">
                  {sidebarPosts.map((p) => <SidebarPost key={p.id} post={p} />)}
                </div>
              ) : (
                <p className="text-xs text-primary-300">Aucun article disponible.</p>
              )}
            </SidebarWidget>



          </aside>
        </MotionDiv>
      </MotionDiv>
    </SectionContainer>
  )
}

export default PostDetailPage
