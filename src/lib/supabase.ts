import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types for our database
export type UserType = 'vendor' | 'organizer' | 'both';

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  user_type: UserType;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  profile_id: string;
  business_name: string | null;
  category: string | null;
  description: string | null;
  location: string | null;
  country: string | null;
  city: string | null;
  services_offered: string[] | null;
  portfolio_images: string[] | null;
  verified: boolean;
  rating: number;
  total_reviews: number;
  total_jobs_completed: number;
  price_range: string | null;
  availability: string;
  created_at: string;
  updated_at: string;
}

export interface Organizer {
  id: string;
  profile_id: string;
  organization_name: string | null;
  organization_type: string;
  location: string | null;
  country: string | null;
  city: string | null;
  events_organized: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
