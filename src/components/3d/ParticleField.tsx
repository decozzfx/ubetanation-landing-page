"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  size?: number
  speed?: number
  color?: string
  opacity?: number
}

function Particles({
  count = 100,
  size = 0.02,
  speed = 0.5,
  color = "#3b82f6",
  opacity = 0.6
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null!)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10
      
      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
    }
    
    return { positions, velocities }
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += particles.velocities[i] * speed
        positions[i + 1] += particles.velocities[i + 1] * speed
        positions[i + 2] += particles.velocities[i + 2] * speed
        
        // Wrap particles around
        if (positions[i] > 5) positions[i] = -5
        if (positions[i] < -5) positions[i] = 5
        if (positions[i + 1] > 5) positions[i + 1] = -5
        if (positions[i + 1] < -5) positions[i + 1] = 5
        if (positions[i + 2] > 5) positions[i + 2] = -5
        if (positions[i + 2] < -5) positions[i + 2] = 5
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true
      meshRef.current.rotation.y += 0.001 * speed
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function ParticleField(props: ParticleFieldProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: 'transparent' }}
    >
      <Particles {...props} />
    </Canvas>
  )
}

// Preset configurations
export function TechParticles() {
  return (
    <ParticleField
      count={150}
      size={0.03}
      speed={0.3}
      color="#3b82f6"
      opacity={0.4}
    />
  )
}

export function StarField() {
  return (
    <ParticleField
      count={200}
      size={0.02}
      speed={0.1}
      color="#ffffff"
      opacity={0.8}
    />
  )
}

export function EnergyField() {
  return (
    <ParticleField
      count={80}
      size={0.04}
      speed={0.8}
      color="#8b5cf6"
      opacity={0.6}
    />
  )
}