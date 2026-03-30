import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
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
        : 'text-primary-500 md:hover:bg-primary-50 md:hover:text-primary-600'
    }`

  return (
    <MotionHeader
      className="sticky top-0 z-20 mb-[10px] bg-white shadow-lg border-b border-gray-100"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 sm:px-5 md:px-7 lg:px-8">
        <div className="mx-auto w-full max-w-6xl py-2 md:py-0">
          <MotionDiv className="flex items-center justify-between md:hidden" variants={fadeUp}>
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-primary-200 bg-primary-50 text-primary-500 transition-all duration-300 md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="text-xl leading-none">{isOpen ? 'x' : '='}</span>
            </button>
          </MotionDiv>
        </div>
      </div>

      <div className="border-y border-primary-100 bg-white">
        <div className="px-4 sm:px-5 md:px-7 lg:px-8">
          <MotionDiv className="mx-auto flex w-full max-w-6xl flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between md:gap-8" variants={fadeUp}>
            <NavLink to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <motion.img
                src={logo}
                alt={t('brand')}
                className="h-16 w-auto object-contain sm:h-20"
                variants={fadeLeft}
              />
            </NavLink>

            <motion.a
              href="https://www.raidtanjalagouira.ma"
              target="_blank"
              rel="noreferrer"
              className="block w-full md:max-w-[620px]"
              variants={fadeUp}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <motion.img
                src="/riad_tanga_lug_2.jpeg"
                alt="Advertisement"
                className="h-[92px] w-full rounded-lg border border-primary-100 object-cover shadow-sm sm:h-[120px]"
                variants={fadeUp}
              />
            </motion.a>
          </MotionDiv>
        </div>
      </div>

      <div className="border-t border-primary-100 bg-white">
        <div className="px-4 sm:px-5 md:px-7 lg:px-8">
          <MotionDiv className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 py-3" variants={fadeUp}>
            <MotionNav className="hidden flex-row items-center gap-1 md:flex" variants={staggerContainer}>
              <MotionLink variants={fadeUp}><NavLink to="/" className={navClassName} onClick={() => setIsOpen(false)}>{t('navHome')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/events" className={navClassName} onClick={() => setIsOpen(false)}>{t('navEvents')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/actualites" className={navClassName} onClick={() => setIsOpen(false)}>{t('navActualites')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/opportunities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navOpportunities')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/galerie" className={navClassName} onClick={() => setIsOpen(false)}>{t('navGallery')}</NavLink></MotionLink>
              <MotionLink variants={fadeUp}><NavLink to="/contact" className={navClassName} onClick={() => setIsOpen(false)}>{t('navContact')}</NavLink></MotionLink>
            </MotionNav>
            <MotionDiv className="hidden md:block" variants={fadeLeft}>
              <LanguageSwitcher />
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isOpen && (
        <motion.nav
          className="flex flex-col gap-2 border-t border-gray-100 bg-white px-3 py-2 sm:px-4 md:hidden"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <NavLink to="/" className={navClassName} onClick={() => setIsOpen(false)}>{t('navHome')}</NavLink>
          <NavLink to="/events" className={navClassName} onClick={() => setIsOpen(false)}>{t('navEvents')}</NavLink>
          <NavLink to="/actualites" className={navClassName} onClick={() => setIsOpen(false)}>Actualites</NavLink>
          <NavLink to="/opportunities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navOpportunities')}</NavLink>
          <NavLink to="/galerie" className={navClassName} onClick={() => setIsOpen(false)}>{t('navGallery')}</NavLink>
          <NavLink to="/contact" className={navClassName} onClick={() => setIsOpen(false)}>{t('navContact')}</NavLink>
        </motion.nav>
      )}
    </MotionHeader>
  )
}

export default Navbar
