import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import DakhlaWeather from './DakhlaWeather'
import logo from '../assets/logo.jpeg'
import { fadeLeft, fadeUp, staggerContainer } from '../utils/animations'

function Navbar() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const MotionHeader = motion.header
  const MotionDiv = motion.div
  const MotionNav = motion.nav
  const MotionLink = motion.div

  const navClassName = ({ isActive }) =>
    `rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 md:px-4 md:py-2 ${
      isActive
        ? 'bg-secondary-500 text-white'
        : 'text-gray-700 md:hover:bg-secondary-50 md:hover:text-secondary-500 md:hover:scale-[1.02]'
    }`

  return (
    <MotionHeader
      className="sticky top-0 z-20 mb-[10px] bg-white shadow-lg border-b border-gray-100"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 sm:px-5 md:px-7 lg:px-8">
        <div className="mx-auto w-full max-w-6xl py-2 lg:hidden">
          <MotionDiv className="flex items-center justify-between" variants={fadeUp}>
            <div className="flex items-center gap-2">
              <NavLink to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                <motion.img
                  src={logo}
                  alt={t('brand')}
                  className="h-14 w-auto object-contain sm:h-16"
                  variants={fadeLeft}
                />
              </NavLink>
              <DakhlaWeather />
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-xl leading-none text-gray-700"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <span>{isOpen ? 'x' : '='}</span>
              </button>
            </div>
          </MotionDiv>
        </div>
      </div>
      <div className="border-y border-gray-100 bg-white">
        <div className="px-4 sm:px-5 md:px-7 lg:px-8">
          <MotionDiv className="mx-auto w-full max-w-6xl py-3 lg:flex lg:items-center lg:justify-between lg:gap-8" variants={fadeUp}>
            <NavLink to="/" className="hidden lg:flex lg:flex-shrink-0 lg:items-center gap-3" onClick={() => setIsOpen(false)}>
              <motion.img
                src={logo}
                alt={t('brand')}
                className="h-16 w-auto object-contain flex-shrink-0"
                variants={fadeLeft}
              />
              <span className="text-sm font-light text-gray-600 leading-tight max-w-[200px]">
                {t('footerText')}
              </span>
            </NavLink>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="hidden lg:block flex-shrink-0">
                <DakhlaWeather />
              </div>

              <motion.a
                href="https://visitdakhla.ma"
                target="_blank"
                rel="noreferrer"
                className="block w-full lg:w-[80%] flex-shrink-0 lg:ml-auto"
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <motion.img
                  src="/mobile.png"
                  alt="Advertisement"
                  className="h-auto w-full rounded-lg border border-primary-100 object-contain shadow-sm lg:hidden"
                  variants={fadeUp}
                />
                <motion.img
                  src="/banner_1.png"
                  alt="Advertisement"
                  className="hidden h-auto w-full rounded-lg border border-primary-100 object-contain shadow-sm lg:block"
                  variants={fadeUp}
                />
              </motion.a>
            </div>
          </MotionDiv>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-white">
        <div className="px-4 sm:px-5 md:px-7 lg:px-8">
          <MotionDiv className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 py-3" variants={fadeUp}>
            <MotionNav className="hidden flex-row items-center gap-1 lg:flex" variants={staggerContainer}>
              <MotionLink variants={fadeUp}><NavLink to="/" className={navClassName} onClick={() => setIsOpen(false)}>{t('navHome')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/opportunities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navOpportunities')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/events" className={navClassName} onClick={() => setIsOpen(false)}>{t('navEvents')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/galerie" className={navClassName} onClick={() => setIsOpen(false)}>{t('navGallery')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/activities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navActivites')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/contact" className={navClassName} onClick={() => setIsOpen(false)}>{t('navContact')}</NavLink></MotionLink>
            </MotionNav>
            <MotionDiv className="hidden lg:block" variants={fadeLeft}>
              <LanguageSwitcher />
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isOpen && (
        <motion.nav
          className="flex flex-col gap-2 border-t border-gray-100 bg-white px-3 py-2 sm:px-4 lg:hidden"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <NavLink to="/" className={navClassName} onClick={() => setIsOpen(false)}>{t('navHome')}</NavLink>
          <NavLink to="/opportunities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navOpportunities')}</NavLink>
          <NavLink to="/events" className={navClassName} onClick={() => setIsOpen(false)}>{t('navEvents')}</NavLink>
          <NavLink to="/galerie" className={navClassName} onClick={() => setIsOpen(false)}>{t('navGallery')}</NavLink>
          <NavLink to="/activities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navActivites')}</NavLink>
          <NavLink to="/contact" className={navClassName} onClick={() => setIsOpen(false)}>{t('navContact')}</NavLink>
        </motion.nav>
      )}
    </MotionHeader>
  )
}

export default Navbar
