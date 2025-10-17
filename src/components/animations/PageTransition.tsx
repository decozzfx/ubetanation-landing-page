"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  duration: 0.4
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Staggered children animation for lists
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Slide up animation for sections
export const slideUp = {
  initial: {
    opacity: 0,
    y: 60
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Fade in animation
export const fadeIn = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

// Scale in animation
export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Slide in from left
export const slideInLeft = {
  initial: {
    opacity: 0,
    x: -50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Slide in from right
export const slideInRight = {
  initial: {
    opacity: 0,
    x: 50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Float animation
export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut"
    }
  }
}

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut"
    }
  }
}

// Hover animations
export const hoverLift = {
  whileHover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

export const hoverRotate = {
  whileHover: {
    rotate: 5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

// Button animations
export const buttonTap = {
  whileTap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
}

// Loading animations
export const loadingDots = {
  animate: {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut"
    }
  }
}

// Scroll-triggered animations
export const scrollFadeIn = {
  initial: {
    opacity: 0,
    y: 30
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  viewport: {
    once: true,
    margin: "-100px"
  }
}