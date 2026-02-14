'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, X, Sparkles, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentProfile, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  user_type: 'vendor' | 'organizer' | 'both';
}

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // User signed in, fetch their profile
          await checkAuth();
        } else if (event === 'SIGNED_OUT') {
          // User signed out, clear profile
          setProfile(null);
        }
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const userProfile = await getCurrentProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      setProfile(null);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-amber-50/30 to-white backdrop-blur-md border-b border-amber-200/50 shadow-lg shadow-amber-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                event<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-red-600">IQ</span>
              </span>
              <Sparkles className="ml-2 h-5 w-5 text-amber-500 group-hover:rotate-12 transition-transform" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link href="#" className="relative text-gray-700 hover:text-orange-600 font-medium transition-colors group">
                Find Vendors
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#" className="relative text-gray-700 hover:text-orange-600 font-medium transition-colors group">
                List Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="#" className="relative text-gray-700 hover:text-orange-600 font-medium transition-colors group">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
          </div>

          {/* Right Section: Search & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-amber-500 group-hover:text-orange-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border-2 border-amber-200 rounded-full leading-5 bg-white/80 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 sm:text-sm transition-all duration-200 hover:border-orange-300"
                placeholder="Search events..."
              />
            </div>

            {!loading && (
              <>
                {profile ? (
                  /* Authenticated User Menu */
                  <div className="flex items-center gap-3">
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-orange-50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{profile.full_name}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-full transition-all hover:bg-orange-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  /* Guest User Buttons */
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-orange-600 font-medium px-4 py-2 rounded-full transition-all duration-200 hover:bg-orange-50"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/60 hover:scale-105 transform"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors"
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
            className="md:hidden border-t border-amber-200 bg-gradient-to-b from-white to-amber-50/30 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="#" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                Find Vendors
              </Link>
              <Link href="#" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                List Services
              </Link>
              <Link href="#" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                How It Works
              </Link>
            </div>
            <div className="pt-4 pb-4 border-t border-amber-200">
              <div className="px-5 space-y-3">
                {profile ? (
                  /* Authenticated Mobile Menu */
                  <>
                    <Link
                      href="/"
                      className="block text-center w-full px-4 py-3 border-2 border-orange-500 rounded-full shadow-sm text-base font-medium text-orange-600 bg-white hover:bg-orange-50 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <User className="h-5 w-5" />
                        {profile.full_name}
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block text-center w-full px-4 py-3 border border-transparent rounded-full shadow-lg text-base font-semibold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <LogOut className="h-5 w-5" />
                        Logout
                      </div>
                    </button>
                  </>
                ) : (
                  /* Guest Mobile Menu */
                  <>
                    <Link
                      href="/login"
                      className="block text-center w-full px-4 py-3 border-2 border-orange-500 rounded-full shadow-sm text-base font-medium text-orange-600 bg-white hover:bg-orange-50 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      className="block text-center w-full px-4 py-3 border border-transparent rounded-full shadow-lg text-base font-semibold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 transition-all"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
