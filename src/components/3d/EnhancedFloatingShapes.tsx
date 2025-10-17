"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Box, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

interface ShapeProps {
  position: [number, number, number]
  color: string
  scale: number
  rotationSpeed: number
  floatAmplitude: number
  floatSpeed: number
}

function FloatingBox({ position, color, scale, rotationSpeed, floatAmplitude, floatSpeed }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed
      meshRef.current.rotation.y += rotationSpeed * 0.8
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude
    }
  })

  return (
    <Box ref={meshRef} args={[scale, scale, scale]} position={position}>
      <meshStandardMaterial 
        color={color} 
        metalness={0.8} 
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </Box>
  )
}

function FloatingSphere({ position, color, scale, rotationSpeed, floatAmplitude, floatSpeed }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed * 0.5
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * floatSpeed + 1) * floatAmplitude
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * floatSpeed * 0.3) * 0.2
    }
  })

  return (
    <Sphere ref={meshRef} args={[scale * 0.8, 32, 32]} position={position}>
      <meshStandardMaterial 
        color={color} 
        metalness={0.6} 
        roughness={0.3}
        transparent
        opacity={0.7}
      />
    </Sphere>
  )
}

function FloatingOctahedron({ position, color, scale, rotationSpeed, floatAmplitude, floatSpeed }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed * 1.2
      meshRef.current.rotation.z += rotationSpeed * 0.6
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed + 2) * floatAmplitude
      meshRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * floatSpeed * 0.5) * 0.3
    }
  })

  return (
    <Octahedron ref={meshRef} args={[scale * 0.9]} position={position}>
      <meshStandardMaterial 
        color={color} 
        metalness={0.9} 
        roughness={0.1}
        transparent
        opacity={0.6}
      />
    </Octahedron>
  )
}

export default function EnhancedFloatingShapes() {
  const shapes = useMemo(() => [
    {
      type: 'box',
      position: [-2, 1, -2] as [number, number, number],
      color: '#3b82f6',
      scale: 0.8,
      rotationSpeed: 0.01,
      floatAmplitude: 0.5,
      floatSpeed: 1.2
    },
    {
      type: 'sphere',
      position: [2, -1, -1] as [number, number, number],
      color: '#8b5cf6',
      scale: 1,
      rotationSpeed: 0.008,
      floatAmplitude: 0.7,
      floatSpeed: 0.8
    },
    {
      type: 'octahedron',
      position: [-1, -2, 1] as [number, number, number],
      color: '#06b6d4',
      scale: 0.6,
      rotationSpeed: 0.012,
      floatAmplitude: 0.4,
      floatSpeed: 1.5
    },
    {
      type: 'box',
      position: [1.5, 2, 0.5] as [number, number, number],
      color: '#10b981',
      scale: 0.7,
      rotationSpeed: 0.009,
      floatAmplitude: 0.6,
      floatSpeed: 1.1
    },
    {
      type: 'sphere',
      position: [0, 0, -3] as [number, number, number],
      color: '#f59e0b',
      scale: 0.9,
      rotationSpeed: 0.007,
      floatAmplitude: 0.8,
      floatSpeed: 0.9
    },
    {
      type: 'octahedron',
      position: [-2.5, 0, 2] as [number, number, number],
      color: '#ef4444',
      scale: 0.5,
      rotationSpeed: 0.015,
      floatAmplitude: 0.3,
      floatSpeed: 1.8
    }
  ], [])

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1} 
        color="#ffffff"
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.5} 
        color="#3b82f6"
      />
      <pointLight 
        position={[0, 10, -10]} 
        intensity={0.3} 
        color="#8b5cf6"
      />
      
      {/* Render shapes */}
      {shapes.map((shape, index) => {
        const shapeProps = {
          position: shape.position,
          color: shape.color,
          scale: shape.scale,
          rotationSpeed: shape.rotationSpeed,
          floatAmplitude: shape.floatAmplitude,
          floatSpeed: shape.floatSpeed
        }

        switch (shape.type) {
          case 'box':
            return <FloatingBox key={index} {...shapeProps} />
          case 'sphere':
            return <FloatingSphere key={index} {...shapeProps} />
          case 'octahedron':
            return <FloatingOctahedron key={index} {...shapeProps} />
          default:
            return null
        }
      })}
    </Canvas>
  )
}

// Minimal version for better performance
export function MinimalFloatingShapes() {
  const shapes = useMemo(() => [
    {
      type: 'box',
      position: [-1, 0.5, -1] as [number, number, number],
      color: '#3b82f6',
      scale: 0.6,
      rotationSpeed: 0.01,
      floatAmplitude: 0.3,
      floatSpeed: 1
    },
    {
      type: 'sphere',
      position: [1, -0.5, 0] as [number, number, number],
      color: '#8b5cf6',
      scale: 0.7,
      rotationSpeed: 0.008,
      floatAmplitude: 0.4,
      floatSpeed: 0.8
    },
    {
      type: 'octahedron',
      position: [0, 0, -2] as [number, number, number],
      color: '#06b6d4',
      scale: 0.5,
      rotationSpeed: 0.012,
      floatAmplitude: 0.2,
      floatSpeed: 1.2
    }
  ], [])

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      
      {shapes.map((shape, index) => {
        const shapeProps = {
          position: shape.position,
          color: shape.color,
          scale: shape.scale,
          rotationSpeed: shape.rotationSpeed,
          floatAmplitude: shape.floatAmplitude,
          floatSpeed: shape.floatSpeed
        }

        switch (shape.type) {
          case 'box':
            return <FloatingBox key={index} {...shapeProps} />
          case 'sphere':
            return <FloatingSphere key={index} {...shapeProps} />
          case 'octahedron':
            return <FloatingOctahedron key={index} {...shapeProps} />
          default:
            return null
        }
      })}
    </Canvas>
  )
}