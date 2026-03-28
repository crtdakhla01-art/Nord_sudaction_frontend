import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { getImageUrl } from '../api/client'
import { usePost } from '../hooks/usePost'
import { usePosts } from '../hooks/usePosts'
import { formatDateLabel } from '../utils/date'

const typeLabel = { article: 'Articles', communique: 'Communiqués', media: 'Médias' }
const typeBadge = {
  article: 'bg-blue-100 text-blue-700',
  communique: 'bg-secondary-500 text-white',
  media: 'bg-emerald-100 text-emerald-700',
}

const partners = ['Amazon', 'NVIDIA', 'Ford', 'Coinbase', 'Google', 'Shopify', 'Mindbody']

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
      <div className="h-14 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-primary-100">
        {post.image ? (
          <img src={getImageUrl(post.image)} alt={post.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
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
  const { slug } = useParams()
  const { data, isLoading, isError, error } = usePost(slug)

  const post = data?.post
  const related = data?.related || []

  const { data: latestData } = usePosts(useMemo(() => ({ page: 1, per_page: 7, type: post?.type }), [post?.type]))
  const sidebarPosts = (latestData?.data || []).filter((p) => p.slug !== slug)
  const shouldAnimatePartners = partners.length > 5
  const partnerItems = shouldAnimatePartners ? [...partners, ...partners] : partners

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} | Nord Sud Action`
    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) descriptionMeta.setAttribute('content', post.description || '')
  }, [post])

  if (isLoading) return <SectionContainer><LoadingState /></SectionContainer>
  if (isError) return <SectionContainer><ErrorState message={error?.message} /></SectionContainer>
  if (!post) return null

  return (
    <SectionContainer>
      <div className="mx-auto w-full max-w-7xl">

        {/* Back link */}
        <Link to="/actualites" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-500 transition hover:text-secondary-600">
          ← Retour aux actualités
        </Link>

        {/* 2-column layout */}
        <div className="grid grid-cols-12 gap-6">

          {/* ── Main article — col-span-8 ── */}
          <main className="col-span-12 lg:col-span-8">
            <article className="overflow-hidden rounded-xl bg-white shadow-md">

              {/* Hero image */}
              {post.image ? (
                <div className="h-64 w-full overflow-hidden sm:h-80 md:h-[420px]">
                  <img src={getImageUrl(post.image)} alt={post.title} className="h-full w-full object-cover" />
                </div>
              ) : null}

              <div className="space-y-5 p-5 sm:p-7">

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${typeBadge[post.type] || 'bg-primary-100 text-primary-500'}`}>
                    {typeLabel[post.type] || post.type}
                  </span>
                  <span className="text-primary-300">•</span>
                  <span className="font-semibold text-primary-400">{formatDateLabel(post.published_at || post.created_at, 'fr')}</span>
                  <span className="text-primary-300">•</span>
                  <span className="font-semibold text-primary-400">{post.view_count} vues</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-primary-500 md:text-3xl">{post.title}</h1>

                {/* Lead description */}
                <p className="border-l-4 border-secondary-500 pl-4 text-base font-medium leading-relaxed text-primary-400">{post.description}</p>

                {/* Rich content */}
                {post.content ? (
                  <div
                    className="prose max-w-none border-t border-primary-100 pt-5 prose-headings:text-primary-500 prose-p:leading-8 prose-p:text-primary-400 prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline"
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
            </article>

            {/* Related posts */}
            {related.length > 0 ? (
              <section className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-secondary-500" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-primary-500">Articles liés</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      to={`/actualites/${item.slug}`}
                      key={item.id}
                      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {item.image ? (
                        <div className="h-32 w-full overflow-hidden bg-primary-50">
                          <img src={getImageUrl(item.image)} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                        </div>
                      ) : (
                        <div className="flex h-28 items-center justify-center bg-primary-50">
                          <span className="text-2xl font-black text-secondary-500 opacity-20">NSA</span>
                        </div>
                      )}
                      <div className="space-y-1 p-3">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${typeBadge[item.type] || 'bg-primary-100 text-primary-500'}`}>
                          {typeLabel[item.type] || item.type}
                        </span>
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-primary-500 group-hover:text-secondary-500 transition-colors">{item.title}</h3>
                        <p className="text-[11px] text-primary-300">{formatDateLabel(item.published_at || item.created_at, 'fr')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </main>

          {/* ── Sidebar — col-span-4 ── */}
          <aside className="col-span-12 space-y-5 lg:col-span-4">

            <SidebarWidget title={`Autres ${typeLabel[post.type] || 'Articles'}`}>
              {sidebarPosts.length > 0 ? (
                <div className="divide-y divide-primary-100">
                  {sidebarPosts.map((p) => <SidebarPost key={p.id} post={p} />)}
                </div>
              ) : (
                <p className="text-xs text-primary-300">Aucun article disponible.</p>
              )}
            </SidebarWidget>


            <div className="overflow-hidden rounded-xl bg-secondary-500 p-5 text-white shadow">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Nord Sud Action</p>
              <h4 className="mt-1 text-base font-extrabold leading-snug">Vous avez une opportunité à partager ?</h4>
              <p className="mt-2 text-xs leading-relaxed text-white/80">Soumettez vos projets, partenariats et appels à initiative sur notre plateforme.</p>
              <Link to="/opportunities" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-secondary-500 transition hover:bg-primary-50">
                Voir les opportunités →
              </Link>
            </div>

          </aside>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-primary-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-secondary-500" />
            <h3 className="text-lg font-extrabold uppercase tracking-wide text-primary-500">Nos partenaires</h3>
          </div>

          <div className={shouldAnimatePartners ? 'partners-marquee' : 'flex flex-wrap gap-3'}>
            <div className={shouldAnimatePartners ? 'partners-track' : 'contents'}>
              {partnerItems.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="inline-flex h-14 min-w-[160px] items-center justify-center rounded-xl border border-primary-100 bg-primary-50 px-6 text-base font-bold text-primary-500"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SectionContainer>
  )
}

export default PostDetailPage
