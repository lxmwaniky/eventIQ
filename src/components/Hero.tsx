'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Torus, Cone, Box } from '@react-three/drei';
import * as THREE from 'three';

const AfricanShapes = () => {
  const meshRef1 = useRef<THREE.Mesh>(null!);
  const meshRef2 = useRef<THREE.Mesh>(null!);
  const meshRef3 = useRef<THREE.Mesh>(null!);
  const meshRef4 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef1.current) {
        meshRef1.current.rotation.x = time * 0.3;
        meshRef1.current.rotation.y = time * 0.2;
    }
    if (meshRef2.current) {
        meshRef2.current.rotation.x = time * 0.2;
        meshRef2.current.rotation.z = time * 0.3;
    }
    if (meshRef3.current) {
        meshRef3.current.rotation.y = time * 0.25;
        meshRef3.current.rotation.z = time * 0.15;
    }
    if (meshRef4.current) {
        meshRef4.current.rotation.x = time * 0.15;
        meshRef4.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group>
      {/* Terracotta Sphere */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2.5}>
        <Sphere args={[1.2, 32, 32]} position={[3, 0, -2]} ref={meshRef1}>
          <meshStandardMaterial
            color="#d97706"
            roughness={0.3}
            metalness={0.2}
            emissive="#d97706"
            emissiveIntensity={0.1}
          />
        </Sphere>
      </Float>

      {/* Orange Torus */}
      <Float speed={2.2} rotationIntensity={2} floatIntensity={2}>
        <Torus args={[0.9, 0.25, 16, 32]} position={[-2.5, 1.5, -3]} ref={meshRef2}>
          <meshStandardMaterial
            color="#ea580c"
            roughness={0.3}
            metalness={0.2}
            emissive="#ea580c"
            emissiveIntensity={0.15}
          />
        </Torus>
      </Float>

      {/* Amber Cone */}
      <Float speed={1.8} rotationIntensity={1.3} floatIntensity={2.2}>
        <Cone args={[0.7, 1.5, 6]} position={[1, -2, -1]} ref={meshRef3}>
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.4}
            metalness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </Cone>
      </Float>

      {/* Red Box */}
      <Float speed={1.6} rotationIntensity={1.8} floatIntensity={2}>
        <Box args={[0.8, 0.8, 0.8]} position={[-1, -1, -2]} ref={meshRef4}>
          <meshStandardMaterial
            color="#dc2626"
            roughness={0.35}
            metalness={0.15}
            emissive="#dc2626"
            emissiveIntensity={0.1}
          />
        </Box>
      </Float>

      <Environment preset="sunset" />
    </group>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20 overflow-hidden">
      {/* African Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="2" fill="#d97706"/>
              <path d="M 40 20 L 50 35 L 65 35 L 52 47 L 57 62 L 40 50 L 23 62 L 28 47 L 15 35 L 30 35 Z" fill="#ea580c" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroPattern)"/>
        </svg>
      </div>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#f59e0b" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ea580c" />
          <AfricanShapes />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl shadow-orange-200/50 lg:bg-white/80 border border-orange-100"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="h-6 w-6 text-amber-500" />
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 uppercase tracking-wider">
              Africa&apos;s Event Marketplace
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            <span className="text-gray-900">Events Made</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 animate-gradient">
              Uniquely African
            </span>
          </h1>

          <p className="text-xl text-gray-700 mb-8 max-w-lg leading-relaxed">
            Connect with Africa&apos;s finest event organizers and vendors. From Lagos to Nairobi, from Accra to Cape Town.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-amber-500 group-hover:text-orange-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-300 shadow-sm hover:border-orange-300"
                placeholder="Search vendors..."
              />
            </div>
            <button className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/70 hover:scale-105 transform whitespace-nowrap">
              Explore Now
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-gray-600 font-medium">1000+ Active Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-gray-600 font-medium">Across 20+ Countries</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side spacer for 3D elements */}
        <div className="hidden lg:block h-96"></div>
      </div>
    </section>
  );
};

export default Hero;
