function Card({ children, className = '' }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-md transition-all duration-300 md:hover:-translate-y-1 md:hover:border-secondary-200 md:hover:shadow-xl ${className}`}
    >
      {children}
    </article>
  )
}

export default Card
