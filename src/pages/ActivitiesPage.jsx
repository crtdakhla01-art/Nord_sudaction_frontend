import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SectionContainer from '../components/SectionContainer'
import { useActivities } from '../hooks/useActivities'
import { motion } from 'framer-motion'
import { fadeLeft, fadeUp, inViewViewport, scaleHover, staggerContainer } from '../utils/animations'
import { getImageUrl } from '../api/client'

function ActivitiesPage() {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1
  const MotionArticle = motion.article
  const MotionLink = motion.a

  const { data: activities, isLoading, isError, error } = useActivities()

  return (
    <SectionContainer>
      <MotionDiv
        className="mx-auto w-full max-w-6xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={inViewViewport}
      >
        <MotionH1
          className="text-4xl font-extrabold text-primary-500 md:text-5xl"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          Presse et medias
        </MotionH1>

        <div className="mt-8">
          {isLoading ? <LoadingState /> : null}
          {isError ? <ErrorState message={error?.message} /> : null}

          {!isLoading && !isError ? (
            <MotionDiv
              className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              {(activities || []).length === 0 ? (
                <p className="text-primary-400">Aucune activité disponible.</p>
              ) : null}
              {(activities || []).map((activity) => (
                <MotionArticle
                  key={activity.id}
                  className="interactive-card flex cursor-pointer flex-col overflow-hidden rounded-xl border border-secondary-100 bg-primary-50 shadow transition-all duration-300"
                  variants={fadeUp}
                  whileHover={scaleHover.whileHover}
                  whileTap={scaleHover.whileTap}
                  transition={scaleHover.transition}
                >
                  {activity.image ? (
                    <div className="h-40 w-full overflow-hidden">
                      <img
                        src={getImageUrl(activity.image)}
                        alt={activity.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <h3 className="text-base font-bold leading-snug text-primary-500">{activity.title}</h3>
                    <MotionLink
                      href={activity.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 block w-full rounded-xl bg-secondary-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-secondary-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      Voir l'activité
                    </MotionLink>
                  </div>
                </MotionArticle>
              ))}
            </MotionDiv>
          ) : null}
        </div>
      </MotionDiv>
    </SectionContainer>
  )
}

export default ActivitiesPage
