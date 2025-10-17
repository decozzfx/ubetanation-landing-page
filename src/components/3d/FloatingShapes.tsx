"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

function FloatingBox({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} opacity={0.8} transparent />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={color} opacity={0.7} transparent />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.008 * speed;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial color={color} opacity={0.6} transparent />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Floating shapes in different positions */}
      <FloatingBox position={[-4, 2, -2]} color="#3b82f6" speed={0.8} />
      <FloatingSphere position={[3, -1, -1]} color="#8b5cf6" speed={1.2} />
      <FloatingOctahedron position={[-2, -3, 1]} color="#06b6d4" speed={1.5} />
      <FloatingBox position={[5, 3, -3]} color="#10b981" speed={0.6} />
      <FloatingSphere position={[-5, -2, 2]} color="#f59e0b" speed={0.9} />
      <FloatingOctahedron position={[2, 4, -1]} color="#ef4444" speed={1.1} />
      <FloatingBox position={[4, -4, 3]} color="#8b5cf6" speed={1.3} />
      <FloatingSphere position={[-3, 1, -4]} color="#06b6d4" speed={0.7} />
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

export default function FloatingShapes() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}