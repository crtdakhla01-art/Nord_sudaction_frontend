function SectionContainer({ children, className = '' }) {
  return <section className={`px-3 py-12 sm:px-4 sm:py-14 md:px-6 md:py-16 lg:py-20 ${className}`}>{children}</section>
}

export default SectionContainer
