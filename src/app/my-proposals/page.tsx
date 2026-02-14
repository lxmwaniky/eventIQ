'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Clock,
  DollarSign,
  MessageCircle,
  FileText
} from 'lucide-react';
import { getCurrentProfile, getVendorDetails } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Proposal {
  id: string;
  cover_letter: string;
  proposed_rate: number;
  delivery_time: string;
  status: string;
  created_at: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    budget_min: number;
    budget_max: number;
  };
}

const MyProposals = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState<string>('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (vendorId) {
      // Subscribe to proposal status changes
      const channel = supabase
        .channel('vendor_proposals')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'proposals',
            filter: `vendor_id=eq.${vendorId}`,
          },
          (payload) => {
            console.log('Proposal updated:', payload);
            // Update the specific proposal in state
            setProposals((current) =>
              current.map((p) =>
                p.id === payload.new.id ? { ...p, status: payload.new.status } : p
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [vendorId]);

  const checkAuth = async () => {
    try {
      const userProfile = await getCurrentProfile();
      if (!userProfile || userProfile.user_type !== 'vendor') {
        router.push('/');
        return;
      }
      setProfile(userProfile);

      const vendorDetails = await getVendorDetails(userProfile.id);
      if (vendorDetails) {
        setVendorId(vendorDetails.id);
        await fetchProposals(vendorDetails.id);
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async (vId: string) => {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        job:jobs!proposals_job_id_fkey (
          id,
          title,
          description,
          location,
          budget_min,
          budget_max
        )
      `)
      .eq('vendor_id', vId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
      return;
    }

    setProposals(data || []);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'withdrawn': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Proposals</h1>
          <p className="text-gray-600">Track your submitted proposals and their status</p>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-600 mb-6">Start browsing jobs and submit your first proposal</p>
            <button
              onClick={() => router.push('/vendor/jobs')}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{proposal.job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{proposal.job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>Your rate: KSH {proposal.proposed_rate?.toLocaleString()}</span>
                      </div>
                      {proposal.delivery_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>{proposal.delivery_time}</span>
                        </div>
                      )}
                      <div className="text-gray-500">
                        Submitted {formatDate(proposal.created_at)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Your Proposal</h4>
                      <p className="text-gray-700 text-sm line-clamp-3">{proposal.cover_letter}</p>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    {proposal.status === 'accepted' && (
                      <div className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-lg text-center">
                        ✓ Approved
                      </div>
                    )}
                    <button
                      onClick={() => router.push(`/chat/${proposal.id}`)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat
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

export default MyProposals;
