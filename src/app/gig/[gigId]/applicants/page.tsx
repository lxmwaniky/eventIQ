'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Star
} from 'lucide-react';
import { getCurrentProfile, getOrganizerDetails } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Proposal {
  id: string;
  cover_letter: string;
  proposed_rate: number;
  delivery_time: string;
  status: string;
  created_at: string;
  vendor: {
    id: string;
    business_name: string;
    category: string;
    description: string;
    profile: {
      id: string;
      full_name: string;
      email: string;
    };
  };
}

const Applicants = () => {
  const router = useRouter();
  const params = useParams();
  const gigId = params?.gigId as string;
  
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [gig, setGig] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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
      await fetchGigAndProposals();
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchGigAndProposals = async () => {
    // Fetch gig details
    const { data: gigData, error: gigError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', gigId)
      .single();

    if (gigError) {
      console.error('Error fetching gig:', gigError);
      return;
    }
    setGig(gigData);

    // Fetch proposals with vendor details
    const { data: proposalsData, error: proposalsError } = await supabase
      .from('proposals')
      .select(`
        *,
        vendor:vendors!proposals_vendor_id_fkey (
          id,
          business_name,
          category,
          description,
          profile:profiles!vendors_profile_id_fkey (
            id,
            full_name,
            email
          )
        )
      `)
      .eq('job_id', gigId)
      .order('created_at', { ascending: false });

    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError);
      return;
    }

    setProposals(proposalsData || []);
  };

  const updateProposalStatus = async (proposalId: string, status: string) => {
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', proposalId);

    if (error) {
      console.error('Error updating proposal:', error);
      return;
    }

    // Refresh proposals
    await fetchGigAndProposals();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/my-gigs')}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to My Gigs
        </button>

        {/* Gig Header */}
        {gig && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{gig.title}</h1>
            <p className="text-gray-600">{gig.description}</p>
          </div>
        )}

        {/* Applicants List */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Applicants ({proposals.length})
          </h2>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-600">Check back later for vendor proposals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                      {proposal.vendor.business_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{proposal.vendor.business_name}</h3>
                      <p className="text-sm text-gray-600">{proposal.vendor.profile.full_name}</p>
                      <p className="text-xs text-gray-500">{proposal.vendor.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                    {proposal.status.toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{proposal.cover_letter}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {proposal.proposed_rate && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">KSH {proposal.proposed_rate.toLocaleString()}</span>
                    </div>
                  )}
                  {proposal.delivery_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{proposal.delivery_time}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Applied {formatDate(proposal.created_at)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {proposal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateProposalStatus(proposal.id, 'accepted')}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => updateProposalStatus(proposal.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => router.push(`/chat/${proposal.id}`)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2 ml-auto"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
