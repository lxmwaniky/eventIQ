'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                event<span className="text-green-600">IQ</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Find Talent
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Find Work
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Why eventIQ
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Enterprise
              </Link>
            </nav>
          </div>

          {/* Right Section: Search & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm transition-all duration-200"
                placeholder="Search"
              />
            </div>
            
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-green-600 font-medium px-3 py-2 rounded-md transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full transition-colors shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Find Talent
              </Link>
              <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Find Work
              </Link>
              <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Why eventIQ
              </Link>
              <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Enterprise
              </Link>
            </div>
            <div className="pt-4 pb-4 border-t border-gray-200">
              <div className="px-5 space-y-4">
                <Link 
                  href="/login" 
                  className="block text-center w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-green-600 bg-white hover:bg-gray-50 border-green-600"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className="block text-center w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
