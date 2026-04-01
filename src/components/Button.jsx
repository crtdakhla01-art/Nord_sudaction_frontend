import { createElement } from 'react'

function Button({ as = 'button', variant = 'primary', className = '', ...props }) {
  const baseClass =
    'inline-flex min-h-12 w-full transform-gpu items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 md:hover:scale-[1.05] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary-500 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:px-6'

  const variantClass =
    variant === 'secondary'
      ? 'border border-secondary-500 bg-white text-secondary-500 md:hover:bg-secondary-100'
      : 'bg-secondary-500 text-white shadow-sm md:hover:bg-secondary-700 active:bg-secondary-700'

  return createElement(as, {
    className: `${baseClass} ${variantClass} ${className}`,
    ...props,
  })
}

export default Button
