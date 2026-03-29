import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import logo from '../assets/logo.jpeg'

function Navbar() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const navClassName = ({ isActive }) =>
    `rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 md:px-4 md:py-2 ${
      isActive
        ? 'bg-secondary-500 text-white'
        : 'text-primary-500 md:hover:bg-primary-50 md:hover:text-primary-600'
    }`

  return (
    <header className="sticky top-0 z-20 bg-white shadow-lg border-b border-gray-100">
      <div className="px-4 sm:px-5 md:px-7 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between py-4 md:gap-4">
          {/* Brand */}
          <NavLink to="/" className="-ml-2 flex items-center md:-ml-3" onClick={() => setIsOpen(false)}>
            <img src={logo} alt={t('brand')} className="h-12 w-auto object-contain" />
          </NavLink>

          {/* Navigation - hidden on mobile, shown on desktop */}
          <nav className="hidden flex-row items-center gap-1 md:flex">
            <NavLink to="/" className={navClassName} onClick={() => setIsOpen(false)}>{t('navHome')}</NavLink>
            <NavLink to="/events" className={navClassName} onClick={() => setIsOpen(false)}>{t('navEvents')}</NavLink>
            <NavLink to="/actualites" className={navClassName} onClick={() => setIsOpen(false)}>Actualites</NavLink>
            <NavLink to="/opportunities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navOpportunities')}</NavLink>
            <NavLink to="/contact" className={navClassName} onClick={() => setIsOpen(false)}>{t('navContact')}</NavLink>
          </nav>

          {/* Right section: language switcher + hamburger */}
          <div className="flex items-center gap-2 md:gap-3">
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

            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isOpen && (
        <nav className="flex flex-col gap-2 border-t border-gray-100 bg-white px-3 py-2 sm:px-4 md:hidden">
          <NavLink to="/" className={navClassName} onClick={() => setIsOpen(false)}>{t('navHome')}</NavLink>
          <NavLink to="/events" className={navClassName} onClick={() => setIsOpen(false)}>{t('navEvents')}</NavLink>
          <NavLink to="/actualites" className={navClassName} onClick={() => setIsOpen(false)}>Actualites</NavLink>
          <NavLink to="/opportunities" className={navClassName} onClick={() => setIsOpen(false)}>{t('navOpportunities')}</NavLink>
          <NavLink to="/contact" className={navClassName} onClick={() => setIsOpen(false)}>{t('navContact')}</NavLink>
        </nav>
      )}
    </header>
  )
}

export default Navbar
