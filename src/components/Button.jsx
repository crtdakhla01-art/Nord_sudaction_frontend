import { createElement } from 'react'

function Button({ as = 'button', variant = 'primary', className = '', ...props }) {
  const baseClass =
    'inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary-500 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:px-6'

  const variantClass =
    variant === 'secondary'
      ? 'border border-secondary-500 bg-white text-secondary-500 md:hover:bg-secondary-50'
      : 'bg-secondary-500 text-white shadow-sm md:hover:bg-secondary-600 active:bg-accent-500'

  return createElement(as, {
    className: `${baseClass} ${variantClass} ${className}`,
    ...props,
  })
}

export default Button
