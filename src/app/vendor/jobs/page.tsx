'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign,
  Clock,
  Users,
  Star,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { getCurrentProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string | number;
  title: string;
  description: string;
  budget: string;
  location: string;
  date: string;
  category: string;
  attendees: string;
  duration: string;
  postedAgo: string;
  proposals: number;
  isRealJob?: boolean; // To distinguish real jobs from demo jobs
}

const VendorJobs = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [realJobs, setRealJobs] = useState<Job[]>([]);

  const categories = [
    'all',
    'catering',
    'photography',
    'audio_visual',
    'decor_styling',
    'entertainment',
    'venue_sourcing',
    'event_planning',
  ];

  // Sample jobs (in a real app, this would come from the database)
  const availableJobs: Job[] = [
    {
      id: 1,
      title: 'Corporate Conference Catering - 200 Guests',
      description: 'Looking for a professional catering service for our annual corporate conference. We need breakfast, lunch, and coffee breaks for 200 attendees over 2 days.',
      budget: '$3,000 - $5,000',
      location: 'Nairobi, Kenya',
      date: 'March 15-16, 2026',
      category: 'catering',
      attendees: '200 people',
      duration: '2 days',
      postedAgo: '2 hours ago',
      proposals: 5,
    },
    {
      id: 2,
      title: 'Wedding Photography & Videography',
      description: 'Seeking an experienced photographer and videographer for a wedding celebration. Must have portfolio of previous wedding work.',
      budget: '$1,500 - $2,500',
      location: 'Lagos, Nigeria',
      date: 'April 22, 2026',
      category: 'photography',
      attendees: '150 people',
      duration: '8 hours',
      postedAgo: '5 hours ago',
      proposals: 12,
    },
    {
      id: 3,
      title: 'Sound System & DJ for Birthday Party',
      description: 'Need professional sound system setup and DJ services for a 30th birthday celebration. Prefer someone with experience in Afrobeats and contemporary music.',
      budget: '$800 - $1,200',
      location: 'Accra, Ghana',
      date: 'March 28, 2026',
      category: 'audio_visual',
      attendees: '100 people',
      duration: '6 hours',
      postedAgo: '1 day ago',
      proposals: 8,
    },
    {
      id: 4,
      title: 'Event Decoration - Corporate Gala',
      description: 'Looking for creative decoration and styling services for an upscale corporate gala dinner. Theme: African Heritage meets Modern Elegance.',
      budget: '$2,000 - $3,500',
      location: 'Johannesburg, South Africa',
      date: 'April 5, 2026',
      category: 'decor_styling',
      attendees: '250 people',
      duration: '1 day',
      postedAgo: '3 hours ago',
      proposals: 7,
    },
    {
      id: 5,
      title: 'Live Band for Hotel Grand Opening',
      description: 'Seeking a professional live band for our hotel grand opening event. Must play a mix of jazz, Afrobeat, and contemporary music.',
      budget: '$1,800 - $2,800',
      location: 'Kigali, Rwanda',
      date: 'May 10, 2026',
      category: 'entertainment',
      attendees: '300 people',
      duration: '4 hours',
      postedAgo: '6 hours ago',
      proposals: 4,
    },
    {
      id: 6,
      title: 'Venue Sourcing for Product Launch',
      description: 'Need help finding and securing a venue for tech product launch. Looking for modern space with good AV capabilities.',
      budget: '$500 - $1,000',
      location: 'Nairobi, Kenya',
      date: 'March 30, 2026',
      category: 'venue_sourcing',
      attendees: '120 people',
      duration: '1 day',
      postedAgo: '12 hours ago',
      proposals: 6,
    },
  ];

  // Combine real jobs (at the top) with demo jobs
  const allJobs = [...realJobs, ...availableJobs];
  
  const filteredJobs = selectedCategory === 'all' 
    ? allJobs 
    : allJobs.filter(job => job.category === selectedCategory);

  useEffect(() => {
    checkAuth();
    fetchRealJobs();
  }, []);

  const fetchRealJobs = async () => {
    try {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      if (jobs) {
        // Transform database jobs to match our Job interface
        const transformedJobs: Job[] = jobs.map((job) => {
          const budgetRange = job.budget_min && job.budget_max 
            ? `$${job.budget_min.toLocaleString()} - $${job.budget_max.toLocaleString()}`
            : job.budget_min 
            ? `From $${job.budget_min.toLocaleString()}`
            : 'Budget TBD';
          
          const eventDate = job.event_date 
            ? new Date(job.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : 'Date TBD';
          
          const createdAt = new Date(job.created_at);
          const now = new Date();
          const diffMs = now.getTime() - createdAt.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let postedAgo = '';
          if (diffMins < 60) {
            postedAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
          } else if (diffHours < 24) {
            postedAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
          } else {
            postedAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
          }

          return {
            id: job.id,
            title: job.title,
            description: job.description,
            budget: budgetRange,
            location: job.location,
            date: eventDate,
            category: job.category,
            attendees: job.attendees ? `${job.attendees} people` : 'TBD',
            duration: job.duration || 'TBD',
            postedAgo: postedAgo,
            proposals: job.proposals_count || 0,
            isRealJob: true,
          };
        });
        
        setRealJobs(transformedJobs);
      }
    } catch (error) {
      console.error('Error in fetchRealJobs:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const userProfile = await getCurrentProfile();
      if (!userProfile || userProfile.user_type !== 'vendor') {
        router.push('/');
        return;
      }
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Jobs
          </h1>
          <p className="text-gray-600">
            Find and bid on events that match your expertise
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Jobs' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {job.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>{job.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>{job.attendees}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.postedAgo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.proposals} proposals
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {job.category.replace('_', ' ')}
                    </span>
                    {job.isRealJob && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/vendor/jobs/${job.id}`)}
                  className="ml-4 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Submit Proposal
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              Try selecting a different category or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorJobs;
