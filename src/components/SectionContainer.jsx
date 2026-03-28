function SectionContainer({ children, className = '' }) {
  return <section className={`px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16 lg:py-20 ${className}`}>{children}</section>
}

export default SectionContainer
