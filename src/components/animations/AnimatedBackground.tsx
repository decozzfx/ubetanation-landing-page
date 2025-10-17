"use client"

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'dots' | 'waves' | 'grid' | 'particles'
  className?: string
  intensity?: 'subtle' | 'medium' | 'strong'
  color?: string
}

export function AnimatedBackground({ 
  variant = 'dots',
  className = '',
  intensity = 'medium',
  color = '#3b82f6'
}: AnimatedBackgroundProps) {
  
  const getIntensityValues = () => {
    switch (intensity) {
      case 'subtle':
        return { opacity: 0.1, scale: 0.8, speed: 8 }
      case 'medium':
        return { opacity: 0.2, scale: 1, speed: 6 }
      case 'strong':
        return { opacity: 0.3, scale: 1.2, speed: 4 }
      default:
        return { opacity: 0.2, scale: 1, speed: 6 }
    }
  }

  const { opacity, scale, speed } = getIntensityValues()

  switch (variant) {
    case 'dots':
      return <DotsBackground className={className} opacity={opacity} scale={scale} speed={speed} color={color} />
    case 'waves':
      return <WavesBackground className={className} opacity={opacity} scale={scale} speed={speed} color={color} />
    case 'grid':
      return <GridBackground className={className} opacity={opacity} scale={scale} speed={speed} color={color} />
    case 'particles':
      return <ParticlesBackground className={className} opacity={opacity} scale={scale} speed={speed} color={color} />
    default:
      return <DotsBackground className={className} opacity={opacity} scale={scale} speed={speed} color={color} />
  }
}

interface BackgroundVariantProps {
  className: string
  opacity: number
  scale: number
  speed: number
  color: string
}

function DotsBackground({ className, opacity, scale, speed, color }: BackgroundVariantProps) {
  const dots = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2
    }))
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            backgroundColor: color,
            opacity: opacity
          }}
          animate={{
            scale: [scale * 0.5, scale * 1.5, scale * 0.5],
            opacity: [opacity * 0.3, opacity, opacity * 0.3]
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

function WavesBackground({ className, opacity, scale, speed, color }: BackgroundVariantProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z"
          fill={color}
          fillOpacity={opacity}
          animate={{
            d: [
              "M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z",
              "M0,300 Q300,400 600,300 T1200,300 L1200,600 L0,600 Z",
              "M0,300 Q300,200 600,300 T1200,300 L1200,600 L0,600 Z"
            ]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M0,350 Q300,250 600,350 T1200,350 L1200,600 L0,600 Z"
          fill={color}
          fillOpacity={opacity * 0.6}
          animate={{
            d: [
              "M0,350 Q300,250 600,350 T1200,350 L1200,600 L0,600 Z",
              "M0,350 Q300,450 600,350 T1200,350 L1200,600 L0,600 Z",
              "M0,350 Q300,250 600,350 T1200,350 L1200,600 L0,600 Z"
            ]
          }}
          transition={{
            duration: speed * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </svg>
    </div>
  )
}

function GridBackground({ className, opacity, scale, speed, color }: BackgroundVariantProps) {
  const gridLines = useMemo(() => {
    const lines = []
    const spacing = 40
    
    // Vertical lines
    for (let i = 0; i <= 100; i += spacing / 10) {
      lines.push({
        id: `v-${i}`,
        type: 'vertical',
        position: i,
        delay: Math.random() * 2
      })
    }
    
    // Horizontal lines
    for (let i = 0; i <= 100; i += spacing / 10) {
      lines.push({
        id: `h-${i}`,
        type: 'horizontal',
        position: i,
        delay: Math.random() * 2
      })
    }
    
    return lines
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {gridLines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute"
          style={{
            backgroundColor: color,
            opacity: opacity * 0.5,
            ...(line.type === 'vertical'
              ? {
                  left: `${line.position}%`,
                  top: 0,
                  width: '1px',
                  height: '100%'
                }
              : {
                  top: `${line.position}%`,
                  left: 0,
                  width: '100%',
                  height: '1px'
                })
          }}
          animate={{
            opacity: [opacity * 0.1, opacity * 0.5, opacity * 0.1]
          }}
          transition={{
            duration: speed,
            delay: line.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

function ParticlesBackground({ className, opacity, scale, speed, color }: BackgroundVariantProps) {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      xMovement: (Math.random() - 0.5) * 20,
      yMovement: (Math.random() - 0.5) * 20
    }))
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: opacity
          }}
          animate={{
            x: [0, particle.xMovement, 0],
            y: [0, particle.yMovement, 0],
            scale: [scale * 0.5, scale, scale * 0.5],
            opacity: [opacity * 0.3, opacity, opacity * 0.3]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Preset configurations for different sections
export function HeroBackground() {
  return (
    <AnimatedBackground
      variant="particles"
      intensity="medium"
      color="#3b82f6"
      className="opacity-30"
    />
  )
}

export function SectionBackground() {
  return (
    <AnimatedBackground
      variant="dots"
      intensity="subtle"
      color="#8b5cf6"
      className="opacity-20"
    />
  )
}

export function CallToActionBackground() {
  return (
    <AnimatedBackground
      variant="waves"
      intensity="strong"
      color="#06b6d4"
      className="opacity-25"
    />
  )
}