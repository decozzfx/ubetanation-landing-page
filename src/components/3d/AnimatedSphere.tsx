"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface AnimatedSphereProps {
  color?: string
  speed?: number
  distort?: number
  radius?: number
  position?: [number, number, number]
}

function AnimatedSphereGeometry({
  color = "#3b82f6",
  speed = 1,
  distort = 0.3,
  radius = 1,
  position = [0, 0, 0]
}: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed
      meshRef.current.rotation.y += 0.015 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1
    }
  })

  return (
    <Sphere ref={meshRef} args={[radius, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

export function AnimatedSphere(props: AnimatedSphereProps) {
  const { color, speed, distort, radius, position } = props

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
      <AnimatedSphereGeometry
        color={color}
        speed={speed}
        distort={distort}
        radius={radius}
        position={position}
      />
    </Canvas>
  )
}

// Preset variations
export function TechSphere() {
  return (
    <AnimatedSphere
      color="#3b82f6"
      speed={1.2}
      distort={0.4}
      radius={1.2}
    />
  )
}

export function GlowSphere() {
  return (
    <AnimatedSphere
      color="#8b5cf6"
      speed={0.8}
      distort={0.2}
      radius={1}
    />
  )
}

export function EnergyCore() {
  return (
    <AnimatedSphere
      color="#06b6d4"
      speed={1.5}
      distort={0.5}
      radius={0.8}
    />
  )
}