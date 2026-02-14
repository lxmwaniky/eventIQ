'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  DollarSign,
  Clock
} from 'lucide-react';
import { getCurrentProfile, getVendorDetails } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const SubmitProposal = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [vendorId, setVendorId] = useState<string>('');
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedRate: '',
    deliveryTime: '',
  });

  useEffect(() => {
    checkAuth();
    checkExistingProposal();
  }, []);

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
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const checkExistingProposal = async () => {
    const userProfile = await getCurrentProfile();
    if (!userProfile) return;

    const vendorDetails = await getVendorDetails(userProfile.id);
    if (!vendorDetails) return;

    const { data } = await supabase
      .from('proposals')
      .select('id')
      .eq('job_id', jobId)
      .eq('vendor_id', vendorDetails.id)
      .single();

    if (data) {
      setHasApplied(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!vendorId) {
        setError('Vendor ID not found');
        setLoading(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from('proposals')
        .insert({
          job_id: jobId,
          vendor_id: vendorId,
          cover_letter: formData.coverLetter,
          proposed_rate: parseFloat(formData.proposedRate) || null,
          delivery_time: formData.deliveryTime,
          status: 'pending',
        })
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        setError(insertError.message);
        setLoading(false);
        return;
      }

      console.log('Proposal submitted:', data);
      router.push('/vendor/jobs?proposal_submitted=true');
    } catch (err: any) {
      console.error('Error:', err);
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (hasApplied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-green-200 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Applied</h2>
            <p className="text-gray-600 mb-6">You've already submitted a proposal for this gig.</p>
            <button
              onClick={() => router.push('/vendor/jobs')}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-orange-100"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Proposal</h1>
          <p className="text-gray-600 mb-8">Tell the organizer why you're the best fit for this gig</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                required
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                rows={8}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all resize-none"
                placeholder="Explain your experience, why you're the best fit, and what makes you stand out..."
              />
            </div>

            {/* Proposed Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Rate (KSH)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.proposedRate}
                  onChange={(e) => setFormData({ ...formData, proposedRate: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                  placeholder="150000"
                  min="0"
                />
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delivery Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                  placeholder="e.g., 2 weeks, 1 month, etc."
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Proposal
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitProposal;
