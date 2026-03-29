function SectionContainer({ children, className = '' }) {
  return <section className={`px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:py-12 ${className}`}>{children}</section>
}

export default SectionContainer
