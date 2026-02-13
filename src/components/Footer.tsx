'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 text-white pt-16 pb-8 overflow-hidden">
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="africanPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="3" fill="currentColor"/>
              <circle cx="75" cy="25" r="3" fill="currentColor"/>
              <circle cx="25" cy="75" r="3" fill="currentColor"/>
              <circle cx="75" cy="75" r="3" fill="currentColor"/>
              <path d="M 50 10 L 60 30 L 80 30 L 65 45 L 70 65 L 50 50 L 30 65 L 35 45 L 20 30 L 40 30 Z" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#africanPattern)"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-bold mb-4">
              event<span className="text-amber-400">IQ</span>
            </h3>
            <p className="text-amber-200 leading-relaxed mb-6">
              Connecting African event organizers and vendors with opportunities across the continent.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-amber-300 hover:text-amber-100 transition-colors hover:scale-110 transform">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-amber-300 hover:text-amber-100 transition-colors hover:scale-110 transform">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-amber-300 hover:text-amber-100 transition-colors hover:scale-110 transform">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-amber-300 hover:text-amber-100 transition-colors hover:scale-110 transform">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-amber-400 mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">Find Vendors</Link></li>
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">List Your Services</Link></li>
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">How It Works</Link></li>
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">Success Stories</Link></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-amber-400 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">Help Center</Link></li>
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">Contact Us</Link></li>
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link href="#" className="text-amber-200 hover:text-white transition-colors hover:translate-x-1 inline-block">Terms of Service</Link></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-amber-300 text-sm text-center md:text-left">
              &copy; 2026 eventIQ. Made with ❤️ in Africa
            </p>
            <div className="flex items-center gap-2 text-sm text-amber-300">
              <span className="hidden sm:inline">🌍</span>
              <span>Empowering African Events</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
