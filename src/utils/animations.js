export const inViewViewport = { once: true, margin: '-100px' }

export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
}

export const fadeLeft = {
  hidden: { opacity: 0, x: -40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
}

export const scaleHover = {
  whileHover: {
    scale: 1.04,
    boxShadow: '0 16px 36px rgba(20, 20, 20, 0.12)',
  },
  whileTap: { scale: 0.97 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
}
