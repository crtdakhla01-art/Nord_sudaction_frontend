function Card({ children, className = '' }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-secondary-100 bg-primary-50 shadow-md transition-all duration-300 md:hover:-translate-y-1 md:hover:border-secondary-200 md:hover:shadow-xl ${className}`}
    >
      {children}
    </article>
  )
}

export default Card
