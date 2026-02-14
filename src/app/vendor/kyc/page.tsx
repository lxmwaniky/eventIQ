'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Building2, 
  MapPin, 
  Phone, 
  Briefcase, 
  Upload,
  Loader2,
  ArrowRight,
  Globe,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const VendorKYC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showApproval, setShowApproval] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    phone: '',
    country: '',
    city: '',
  });

  const categories = [
    { value: 'catering', label: 'Catering' },
    { value: 'photography', label: 'Photography' },
    { value: 'audio_visual', label: 'Audio & Visual' },
    { value: 'decor_styling', label: 'Decor & Styling' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'venue_sourcing', label: 'Venue Sourcing' },
    { value: 'event_planning', label: 'Event Planning' },
    { value: 'security', label: 'Security' },
    { value: 'other', label: 'Other' },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate document processing for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

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
        verified: true, // Auto-approve for demo
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

      // Show approval animation
      setLoading(false);
      setShowApproval(true);

      // Redirect to jobs page after approval
      setTimeout(() => {
        router.push('/vendor/jobs');
      }, 2000);
    } catch (err: any) {
      console.error('KYC submission error:', err);
      setError(err?.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.businessName || !formData.category || !formData.description || !formData.phone || !formData.country || !formData.city) {
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
    <>
      {/* KYC Approval Modal */}
      <AnimatePresence>
        {showApproval && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">KYC Approved!</h2>
              <p className="text-gray-600 mb-4">
                Your vendor profile has been verified successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to available jobs...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-8">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
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
                    {step === 1 && 'Business Information'}
                    {step === 2 && 'Document Upload'}
                  </span>
                </div>
                {step < 2 && (
                  <div
                    className={`w-32 h-1 transition-all ${
                      currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
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
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
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

                <div className="grid grid-cols-2 gap-4">
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
                        <option value="">Select country</option>
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
                </div>
              </motion.div>
            )}

            {/* Step 2: Document Upload (Simulation) */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Business Documents *
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your business registration, tax certificates, licenses, or any relevant documents.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-all">
                    <input
                      type="file"
                      id="documents"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="documents" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium mb-2">
                        Click to upload documents
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                      </p>
                    </label>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Uploaded Files ({uploadedFiles.length})
                    </p>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Your documents will be reviewed instantly. Once approved, you can start bidding on available jobs.
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

              {currentStep < 2 ? (
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
                  disabled={loading || uploadedFiles.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing Documents...
                    </>
                  ) : uploadedFiles.length === 0 ? (
                    <>
                      Upload Documents First
                    </>
                  ) : (
                    <>
                      Submit for Approval
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default VendorKYC;
