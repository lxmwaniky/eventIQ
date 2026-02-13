'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  MapPin,
  UtensilsCrossed,
  Music,
  Camera,
  Palette,
  Speaker,
  ShieldCheck
} from 'lucide-react';

const categories = [
  { name: 'Event Planning', count: '1.2k', icon: CalendarDays, gradient: 'from-orange-500 to-amber-500' },
  { name: 'Venue Sourcing', count: '800+', icon: MapPin, gradient: 'from-red-500 to-orange-500' },
  { name: 'Catering Services', count: '2.5k', icon: UtensilsCrossed, gradient: 'from-amber-500 to-yellow-500' },
  { name: 'Audio Visual (AV)', count: '500+', icon: Speaker, gradient: 'from-orange-600 to-red-600' },
  { name: 'Decor & Styling', count: '1.8k', icon: Palette, gradient: 'from-amber-600 to-orange-600' },
  { name: 'Entertainment', count: '3k+', icon: Music, gradient: 'from-red-600 to-orange-700' },
  { name: 'Photography', count: '2k+', icon: Camera, gradient: 'from-orange-500 to-amber-600' },
  { name: 'Security', count: '400+', icon: ShieldCheck, gradient: 'from-red-500 to-amber-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Categories = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-100 to-orange-100 rounded-full blur-3xl opacity-30 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover African
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-red-600"> Talent</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse vendors by category and find the perfect match for your event
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-6 cursor-pointer border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-200/50 overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Icon with gradient background */}
                <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="relative text-lg font-bold text-gray-900 group-hover:text-orange-700 mb-2 transition-colors">
                  {category.name}
                </h3>

                <div className="relative flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">
                    {category.count} vendors
                  </span>
                  <svg
                    className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-700 mb-4">
            Are you a vendor? Join Africa&apos;s largest event marketplace
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/70 hover:scale-105 transform"
          >
            Start Earning Today
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
