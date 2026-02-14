'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Features from "@/components/Features";
import { getCurrentProfile, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Briefcase, LogOut, Settings, User, CheckCircle, X } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  user_type: 'vendor' | 'organizer' | 'both';
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeType, setWelcomeType] = useState<'organizer' | 'vendor' | null>(null);

  useEffect(() => {
    // Check auth on mount
    checkAuth();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkAuth();
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );
    
    // Check for welcome messages
    const welcome = searchParams.get('welcome');
    const login = searchParams.get('login');
    const kycComplete = searchParams.get('kyc_complete');
    
    if (welcome) {
      setWelcomeType(welcome as 'organizer' | 'vendor');
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 5000);
    } else if (login) {
      setWelcomeType(login as 'organizer' | 'vendor');
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 4000);
    } else if (kycComplete) {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 4000);
    }

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [searchParams]);

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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authenticated dashboard
  if (profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Welcome Toast */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 right-4 z-50"
            >
              <div className="bg-white rounded-xl shadow-2xl border-2 border-green-200 p-4 flex items-start gap-3 max-w-md">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">
                    {welcomeType === 'organizer' ? 'Welcome, Organizer!' : 
                     welcomeType === 'vendor' ? 'Welcome back!' : 
                     'Profile Complete!'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {welcomeType === 'organizer' 
                      ? 'Your account is ready. Start finding vendors for your events!'
                      : welcomeType === 'vendor'
                      ? 'Good to see you again!'
                      : 'Your vendor profile is now complete!'}
                  </p>
                </div>
                <button onClick={() => setShowWelcome(false)} className="flex-shrink-0">
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header */}
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border-2 border-orange-100 p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                      profile.user_type === 'vendor' 
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                        : 'bg-gradient-to-br from-red-500 to-orange-500'
                    } shadow-lg`}>
                      {profile.user_type === 'vendor' ? (
                        <Briefcase className="h-10 w-10 text-white" />
                      ) : (
                        <Calendar className="h-10 w-10 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome back, {profile.full_name}!
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        profile.user_type === 'vendor'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {profile.user_type === 'vendor' ? 'Vendor Account' : 'Organizer Account'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/settings')}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {profile.user_type === 'vendor' ? 'Active Bookings' : 'Upcoming Events'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {profile.user_type === 'vendor' ? 'Total Revenue' : 'Total Spent'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">$0</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {profile.user_type === 'vendor' ? 'Recent Activity' : 'Your Events'}
              </h2>
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  {profile.user_type === 'vendor' ? (
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Calendar className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {profile.user_type === 'vendor' 
                    ? 'No bookings yet'
                    : 'No events yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {profile.user_type === 'vendor'
                    ? 'Start receiving bookings by completing your profile and showcasing your services.'
                    : 'Create your first event and start finding the perfect vendors.'}
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                  {profile.user_type === 'vendor' ? 'Update Profile' : 'Create Event'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <>
      <Hero />
      <Categories />
      <Features />
    </>
  );
}
