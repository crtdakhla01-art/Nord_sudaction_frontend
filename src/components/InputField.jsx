function InputField({ label, error, className = '', ...props }) {
  return (
    <label className={`block text-sm font-medium text-primary-500 ${className}`}>
      <span>{label}</span>
      <input
        className="mt-2 block min-h-12 w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-primary-500 shadow-sm outline-none transition-all duration-300 focus:border-secondary-400 focus:ring-2 focus:ring-secondary-500/20 sm:text-base"
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-secondary-600">{error}</span> : null}
    </label>
  )
}

export default InputField
