"use client"

import { motion } from 'framer-motion'

export function SpinnerLoader() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  )
}

export function PulseLoader() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
          className="w-3 h-3 bg-primary rounded-full"
        />
      ))}
    </div>
  )
}

export function BouncingLoader() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -20, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1
          }}
          className="w-4 h-4 bg-primary rounded-full"
        />
      ))}
    </div>
  )
}

export function TypingLoader() {
  return (
    <div className="flex items-center space-x-1">
      <span>Loading</span>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          animate={{
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.3
          }}
        >
          .
        </motion.span>
      ))}
    </div>
  )
}

export function ProgressiveLoader({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      />
    </div>
  )
}

export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded mb-3" />
      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-3/4 mb-3" />
      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-1/2" />
    </div>
  )
}

export function CardSkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-lg mb-4" />
      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded mb-2" />
      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-3/4 mb-2" />
      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-1/2" />
    </div>
  )
}

// Reveal animations
export function RevealText({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function SlideInText({ 
  children, 
  direction = 'left',
  delay = 0 
}: { 
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number 
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -50, y: 0 }
      case 'right': return { x: 50, y: 0 }
      case 'up': return { x: 0, y: -50 }
      case 'down': return { x: 0, y: 50 }
      default: return { x: -50, y: 0 }
    }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition()
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function FadeInScale({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8
      }}
      animate={{ 
        opacity: 1, 
        scale: 1 
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

// Interactive animations
export function HoverCard({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{
        scale: 0.98
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function PressButton({ 
  children, 
  onClick,
  className = ""
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}
      transition={{
        duration: 0.1
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}