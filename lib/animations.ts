/**
 * Framer Motion animation variants for Charter Bus Platform
 * Based on design spec: search.md
 * - Page fade-in: 300ms ease
 * - Slide-up for cards
 * - Hover lift with shadow increase
 * - Stagger for results list
 * - Bottom sheet spring
 * - Gallery transitions
 */

import type { Variants } from 'framer-motion'

// ─── Page Transitions ──────────────────────────────────────────────────────

export const pageFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export const pageSlideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// ─── Card Animations ───────────────────────────────────────────────────────

/** Staggered container for results list */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

/** Individual card slide-up (child of staggerContainer) */
export const cardSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/** Hover lift – attach as whileHover on motion.div */
export const hoverLift = {
  y: -2,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  transition: { duration: 0.2, ease: 'easeOut' as const },
}

/** Button press effect */
export const buttonTap = { scale: 0.98 }

// ─── Hero / Search Card ────────────────────────────────────────────────────

export const heroText: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 },
  },
}

export const heroSubtext: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 },
  },
}

export const heroCard: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 },
  },
}

export const quickFilterBar: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.5 },
  },
}

// ─── Filter Apply ─────────────────────────────────────────────────────────

/** Fade the results out and back in when filters change */
export const filterFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────

export const bottomSheet: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 400,
    },
  },
  exit: {
    y: '100%',
    transition: {
      type: 'spring',
      damping: 35,
      stiffness: 400,
    },
  },
}

export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// ─── Seat Selection ─────────────────────────────────────────────────────────

export const seatSelect: Variants = {
  unselected: { scale: 1 },
  selected: {
    scale: 1.1,
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  },
}

export const checkmarkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut', delay: 0.05 },
  },
}

// ─── Price Counter Animation  ──────────────────────────────────────────────

export const priceUpdate: Variants = {
  initial: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  enter: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

// ─── Gallery ─────────────────────────────────────────────────────────────

export const galleryImage: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  }),
}

// ─── Sidebar / Modal ─────────────────────────────────────────────────────

export const sidebarFade: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const popoverScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
}

// ─── Popular Routes ────────────────────────────────────────────────────────

export const routeCard: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      delay: 0.05 * i,
    },
  }),
}

// ─── Utility ──────────────────────────────────────────────────────────────

/** Use with useReducedMotion() – returns static variants if reduced motion preferred */
export function getMotionVariants<T extends Variants>(
  variants: T,
  reduceMotion: boolean | null
): T {
  if (!reduceMotion) return variants
  // Collapse all transitions to instant
  const staticVariants = {} as T
  for (const key in variants) {
    const v = variants[key]
    if (typeof v === 'function') {
      // Function variant (e.g. routeCard.visible with custom delay)
      // Wrap to override transition with instant
      staticVariants[key] = ((...args: unknown[]) => {
        const result = (v as (...a: unknown[]) => object)(...args)
        return { ...(result as object), transition: { duration: 0 } }
      }) as T[typeof key]
    } else if (typeof v === 'object' && v !== null) {
      staticVariants[key] = { ...v, transition: { duration: 0 } } as T[typeof key]
    }
  }
  return staticVariants
}
