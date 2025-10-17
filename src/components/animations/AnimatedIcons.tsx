"use client"

import { motion } from 'framer-motion'
import { 
  Code, 
  Rocket, 
  Cloud, 
  Zap, 
  Shield, 
  Globe,
  Users,
  Award,
  CheckCircle,
  Star,
  Heart,
  TrendingUp
} from 'lucide-react'

interface AnimatedIconProps {
  Icon: any
  delay?: number
  color?: string
  size?: number
  className?: string
}

export function AnimatedIcon({ 
  Icon, 
  delay = 0, 
  color = "currentColor", 
  size = 24, 
  className = "" 
}: AnimatedIconProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay
      }}
      whileHover={{
        scale: 1.2,
        rotate: 5,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <Icon size={size} color={color} />
    </motion.div>
  )
}

export function FloatingIcon({ 
  Icon, 
  delay = 0, 
  color = "currentColor", 
  size = 24, 
  className = "" 
}: AnimatedIconProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: delay * 2
        }}
      >
        <Icon size={size} color={color} />
      </motion.div>
    </motion.div>
  )
}

export function PulsingIcon({ 
  Icon, 
  delay = 0, 
  color = "currentColor", 
  size = 24, 
  className = "" 
}: AnimatedIconProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay
      }}
      className={className}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay
        }}
      >
        <Icon size={size} color={color} />
      </motion.div>
    </motion.div>
  )
}

export function SpinningIcon({ 
  Icon, 
  delay = 0, 
  color = "currentColor", 
  size = 24, 
  className = "" 
}: AnimatedIconProps) {
  return (
    <motion.div
      initial={{ rotate: 0, scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{
        rotate: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay
        }
      }}
      className={className}
    >
      <Icon size={size} color={color} />
    </motion.div>
  )
}

// Loading animation
export function LoadingIcon() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
    </motion.div>
  )
}

// Success animation
export function SuccessIcon() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15
      }}
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <CheckCircle className="w-8 h-8 text-green-500" />
      </motion.div>
    </motion.div>
  )
}

// Staggered icon grid
interface IconGridProps {
  icons: any[]
  colors?: string[]
  className?: string
}

export function StaggeredIconGrid({ icons, colors = [], className = "" }: IconGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
      className={`grid grid-cols-3 gap-6 ${className}`}
    >
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { y: 20, opacity: 0, scale: 0.8 },
            visible: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }
          }}
          whileHover={{
            scale: 1.1,
            y: -5,
            transition: { duration: 0.2 }
          }}
          className="flex items-center justify-center p-4 bg-primary/5 rounded-lg"
        >
          <Icon 
            size={32} 
            color={colors[index] || "#3b82f6"} 
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

// Floating icon cloud
export function FloatingIconCloud() {
  const techIcons = [Code, Rocket, Cloud, Zap, Shield, Globe, Users, Award]
  
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {techIcons.map((Icon, index) => (
        <FloatingIcon
          key={index}
          Icon={Icon}
          delay={index * 0.2}
          size={20}
          color="#3b82f6"
          className={`absolute ${getRandomPosition()}`}
        />
      ))}
    </div>
  )
}

function getRandomPosition() {
  const positions = [
    "top-4 left-4",
    "top-8 right-16",
    "top-16 left-1/3",
    "top-20 right-4",
    "top-32 left-16",
    "top-12 right-1/3",
    "top-24 left-1/2",
    "top-4 right-1/4"
  ]
  return positions[Math.floor(Math.random() * positions.length)]
}

// Animated counter
interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ 
  from, 
  to, 
  duration = 2, 
  suffix = "", 
  className = "" 
}: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15
        }}
      >
        <motion.span
          transition={{
            duration,
            ease: "easeOut"
          }}
        >
          {from}{suffix}
        </motion.span>
      </motion.span>
    </motion.span>
  )
}