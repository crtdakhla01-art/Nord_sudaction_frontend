/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Enable RTL support globally via Tailwind's dir selector
  // When dir="rtl" is on HTML element, rtl: variant classes will be applied
  safelist: [
    // Comprehensive RTL classes safelist for navbar and general use
    // Flexbox utilities
    'rtl:flex-row-reverse',
    'rtl:justify-start',
    'rtl:justify-end',
    'rtl:justify-between',
    // Text alignment
    'rtl:text-left',
    'rtl:text-right',
    // Padding and margin - spacing
    'rtl:pl-0', 'rtl:pl-1', 'rtl:pl-2', 'rtl:pl-3', 'rtl:pl-4', 'rtl:pl-5', 'rtl:pl-6', 'rtl:pl-7', 'rtl:pl-8',
    'rtl:pr-0', 'rtl:pr-1', 'rtl:pr-2', 'rtl:pr-3', 'rtl:pr-4', 'rtl:pr-5', 'rtl:pr-6', 'rtl:pr-7', 'rtl:pr-8',
    'rtl:ml-0', 'rtl:ml-1', 'rtl:ml-2', 'rtl:ml-3', 'rtl:ml-auto',
    'rtl:mr-0', 'rtl:mr-1', 'rtl:mr-2', 'rtl:mr-3', 'rtl:mr-auto',
    // Origin and translate
    'rtl:origin-right',
    'rtl:origin-left',
    // Order
    'rtl:order-1', 'rtl:order-2', 'rtl:order-3', 'rtl:order-4', 'rtl:order-5',
    'rtl:-order-1', 'rtl:-order-2', 'rtl:-order-3',
    // Transform
    'rtl:scale-x-[-1]',
  ],
  corePlugins: {
    container: false,
  },
}

// Enable RTL support: https://tailwindcss.com/docs/rtl-styling
// Tailwind will automatically use 'rtl' selector when dir="rtl" is on HTML element
