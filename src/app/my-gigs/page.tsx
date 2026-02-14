'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock
} from 'lucide-react';
import { getCurrentProfile, getOrganizerDetails } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  location: string;
  event_date: string;
  attendees: number;
  status: string;
  proposals_count: number;
  created_at: string;
}

const MyGigs = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizerId, setOrganizerId] = useState<string>('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userProfile = await getCurrentProfile();
      if (!userProfile || userProfile.user_type !== 'organizer') {
        router.push('/');
        return;
      }
      setProfile(userProfile);

      const organizerDetails = await getOrganizerDetails(userProfile.id);
      if (organizerDetails) {
        setOrganizerId(organizerDetails.id);
        await fetchGigs(organizerDetails.id);
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchGigs = async (orgId: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('organizer_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gigs:', error);
      return;
    }

    setGigs(data || []);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Gigs</h1>
            <p className="text-gray-600">Manage your posted gigs and view applicants</p>
          </div>
          <button
            onClick={() => router.push('/create-gig')}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Post New Gig
          </button>
        </div>

        {/* Gigs List */}
        {gigs.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No gigs yet</h3>
            <p className="text-gray-600 mb-6">Create your first gig to start finding vendors</p>
            <button
              onClick={() => router.push('/create-gig')}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Post Your First Gig
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {gigs.map((gig, index) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{gig.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
                        {gig.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{gig.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">
                          KSH {gig.budget_min?.toLocaleString()} - {gig.budget_max?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        <span>{gig.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{formatDate(gig.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>{gig.attendees} people</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        Posted {formatDate(gig.created_at)}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-orange-600">
                        <Briefcase className="h-4 w-4" />
                        {gig.proposals_count} proposal{gig.proposals_count !== 1 ? 's' : ''}
                      </span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {gig.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => router.push(`/gig/${gig.id}/applicants`)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <Eye className="h-4 w-4" />
                      View Applicants
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
