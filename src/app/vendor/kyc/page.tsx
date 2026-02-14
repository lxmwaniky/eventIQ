'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Building2, 
  MapPin, 
  Phone, 
  Briefcase, 
  Image as ImageIcon,
  Upload,
  Loader2,
  ArrowRight,
  Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const VendorKYC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    phone: '',
    country: '',
    city: '',
    servicesOffered: [] as string[],
    priceRange: '',
  });

  const categories = [
    'Catering',
    'Photography',
    'Videography',
    'Decoration',
    'Entertainment',
    'Venue',
    'Sound & Lighting',
    'MC/Hosting',
    'Security',
    'Transportation',
    'Makeup & Beauty',
    'Other',
  ];

  const countries = [
    'Kenya',
    'Nigeria',
    'South Africa',
    'Ghana',
    'Tanzania',
    'Uganda',
    'Rwanda',
    'Ethiopia',
    'Other',
  ];

  const priceRanges = [
    'Budget (< $100)',
    'Standard ($100 - $500)',
    'Premium ($500 - $1,500)',
    'Luxury (> $1,500)',
  ];

  const handleAddService = (service: string) => {
    if (!formData.servicesOffered.includes(service)) {
      setFormData({
        ...formData,
        servicesOffered: [...formData.servicesOffered, service],
      });
    }
  };

  const handleRemoveService = (service: string) => {
    setFormData({
      ...formData,
      servicesOffered: formData.servicesOffered.filter((s) => s !== service),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to complete KYC');
        setLoading(false);
        return;
      }

      // Get user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        setError('Profile not found. Please contact support.');
        setLoading(false);
        return;
      }

      // Update profile with phone
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          phone: formData.phone,
        })
        .eq('id', profile.id);

      if (updateProfileError) {
        console.error('Profile update error:', {
          message: updateProfileError.message,
          details: updateProfileError.details,
          hint: updateProfileError.hint,
          code: updateProfileError.code,
        });
        setError(`Failed to update profile: ${updateProfileError.message}`);
        setLoading(false);
        return;
      }

      // Check if vendor record exists
      const { data: existingVendor, error: vendorCheckError } = await supabase
        .from('vendors')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      if (vendorCheckError && vendorCheckError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is fine
        console.error('Vendor check error:', {
          message: vendorCheckError.message,
          details: vendorCheckError.details,
          hint: vendorCheckError.hint,
          code: vendorCheckError.code,
        });
        setError(`Database error: ${vendorCheckError.message}`);
        setLoading(false);
        return;
      }

      // Prepare vendor data
      const vendorData = {
        business_name: formData.businessName,
        category: formData.category,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        location: `${formData.city}, ${formData.country}`,
        services_offered: formData.servicesOffered,
        price_range: formData.priceRange,
      };

      let vendorError;

      if (existingVendor) {
        // Update existing vendor record
        const { error } = await supabase
          .from('vendors')
          .update(vendorData)
          .eq('profile_id', profile.id);
        vendorError = error;
      } else {
        // Create new vendor record
        const { error } = await supabase
          .from('vendors')
          .insert({
            ...vendorData,
            profile_id: profile.id,
            availability: 'available',
          });
        vendorError = error;
      }

      if (vendorError) {
        console.error('Vendor operation error:', {
          message: vendorError.message,
          details: vendorError.details,
          hint: vendorError.hint,
          code: vendorError.code,
        });
        setError(`Failed to save vendor information: ${vendorError.message}`);
        setLoading(false);
        return;
      }

      // Success! Redirect to dashboard
      router.push('/?kyc_complete=true');
    } catch (err: any) {
      console.error('KYC submission error:', err);
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.businessName || !formData.category || !formData.description) {
        setError('Please fill in all required fields');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.phone || !formData.country || !formData.city) {
        setError('Please fill in all required fields');
        return;
      }
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      step
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600">
                    {step === 1 && 'Business Info'}
                    {step === 2 && 'Contact & Location'}
                    {step === 3 && 'Services & Pricing'}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all ${
                      currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-orange-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Vendor Profile
            </h1>
            <p className="text-gray-600">
              Help event organizers find you by completing your business information
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({ ...formData, businessName: e.target.value })
                      }
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                      placeholder="e.g., Elite Events Catering"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all resize-none"
                    placeholder="Tell us about your business, experience, and what makes you unique..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact & Location */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                      placeholder="e.g., Nairobi"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Services & Pricing */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Services Offered
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Full Service Catering',
                      'Event Photography',
                      'Video Production',
                      'Stage Design',
                      'Sound System',
                      'Lighting',
                      'DJ Services',
                      'Live Band',
                      'MC Services',
                      'Event Planning',
                      'Security',
                      'Transportation',
                    ].map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() =>
                          formData.servicesOffered.includes(service)
                            ? handleRemoveService(service)
                            : handleAddService(service)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.servicesOffered.includes(service)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={formData.priceRange}
                    onChange={(e) =>
                      setFormData({ ...formData, priceRange: e.target.value })
                    }
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all"
                  >
                    <option value="">Select your typical price range</option>
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> You'll be able to add portfolio images and more details
                    from your dashboard after completing this setup.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Previous
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorKYC;
