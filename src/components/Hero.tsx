'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
  const meshRef1 = useRef<THREE.Mesh>(null!);
  const meshRef2 = useRef<THREE.Mesh>(null!);
  const meshRef3 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef1.current) {
        meshRef1.current.rotation.x = time * 0.2;
        meshRef1.current.rotation.y = time * 0.3;
    }
    if (meshRef2.current) {
        meshRef2.current.rotation.x = time * 0.15;
        meshRef2.current.rotation.y = time * 0.25;
    }
    if (meshRef3.current) {
        meshRef3.current.rotation.x = time * 0.1;
        meshRef3.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 32, 32]} position={[2, 0, -2]} ref={meshRef1}>
          <meshStandardMaterial color="#14a800" roughness={0.4} metalness={0.1} />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Torus args={[0.8, 0.2, 16, 32]} position={[-2, 1, -3]} ref={meshRef2}>
          <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.1} />
        </Torus>
      </Float>
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.8}>
        <Sphere args={[0.6, 32, 32]} position={[0, -2, -1]} ref={meshRef3}>
          <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.1} />
        </Sphere>
      </Float>
      <Environment preset="city" />
    </group>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-gray-50 pt-20 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingShapes />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl lg:bg-transparent lg:backdrop-blur-none lg:shadow-none lg:p-0"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
            How events <br />
            <span className="text-green-600">should work</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg">
            Forget the old rules. You can have the best organizers and vendors. Right now. Right here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
             <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 shadow-sm"
                    placeholder="Search for services..."
                />
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-4 rounded-full transition-colors shadow-md hover:shadow-lg whitespace-nowrap">
              Get Started
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <span>Trusted by:</span>
            <div className="flex gap-4 grayscale opacity-70">
               {/* Placeholders for logos */}
               <div className="font-bold">Microsoft</div>
               <div className="font-bold">Airbnb</div>
               <div className="font-bold">Bissell</div>
            </div>
          </div>
        </motion.div>
        
        {/* Right side spacer for 3D elements or additional image if needed */}
        <div className="hidden lg:block h-96"></div>
      </div>
    </section>
  );
};

export default Hero;
