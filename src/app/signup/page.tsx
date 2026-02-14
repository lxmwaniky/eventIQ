'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ArrowRight, CheckCircle } from 'lucide-react';

const RoleSelection = () => {
  const roles = [
    {
      type: 'vendor',
      title: "I'm a Vendor",
      subtitle: 'Offer your services',
      icon: Briefcase,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      benefits: [
        'Get discovered by event organizers',
        'Showcase your portfolio',
        'Receive bookings & payments',
        'Build your reputation',
      ],
      link: '/signup/vendor',
    },
    {
      type: 'organizer',
      title: "I'm an Organizer",
      subtitle: 'Find vendors for your events',
      icon: Calendar,
      gradient: 'from-red-500 via-orange-500 to-amber-500',
      benefits: [
        'Browse verified vendors',
        'Compare quotes instantly',
        'Manage all your events',
        'Book with confidence',
      ],
      link: '/signup/organizer',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-32 pb-16 px-4 relative overflow-hidden">
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="signupPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="2" fill="#d97706"/>
              <path d="M 40 20 L 50 35 L 65 35 L 52 47 L 57 62 L 40 50 L 23 62 L 28 47 L 15 35 L 30 35 Z" fill="#ea580c" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signupPattern)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm text-orange-700 font-semibold text-sm border-2 border-orange-200 shadow-lg">
              Join Africa's Event Marketplace
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-red-600"> Journey</span>
          </h1>

          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Select how you'd like to join eventIQ and start connecting with Africa's event professionals
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <Link href={role.link}>
                  <div className="relative h-full bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 overflow-hidden cursor-pointer">
                    {/* Animated Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                    {/* Decorative Circle */}
                    <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${role.gradient} opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>

                    {/* Icon */}
                    <div className="relative mb-8">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${role.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                        {role.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-8">
                        {role.subtitle}
                      </p>

                      {/* Benefits */}
                      <ul className="space-y-4 mb-8">
                        {role.benefits.map((benefit, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${role.gradient} text-white font-semibold px-8 py-4 rounded-full group-hover:shadow-xl transition-all duration-300`}>
                        <span>Get Started as {role.type === 'vendor' ? 'Vendor' : 'Organizer'}</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>

                    {/* Decorative Bottom Bar */}
                    <div className={`absolute bottom-0 left-0 h-2 w-0 bg-gradient-to-r ${role.gradient} group-hover:w-full transition-all duration-700 rounded-b-3xl`}></div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Already have account */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-700 text-lg">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors">
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;
