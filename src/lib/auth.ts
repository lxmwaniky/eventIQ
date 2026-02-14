import { supabase, SignupData, UserType } from './supabase';

/**
 * Sign up a new user with Supabase Auth
 */
export async function signUp(data: SignupData) {
  try {
    // Trim and validate inputs
    const email = data.email.trim().toLowerCase();
    const fullName = data.fullName.trim();

    // Validate password strength
    if (data.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long',
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    // 1. Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: data.password,
      options: {
        data: {
          full_name: fullName,
          user_type: data.userType,
        },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return {
        success: false,
        error: authError.message || 'Failed to create account',
      };
    }
    if (!authData.user) {
      return {
        success: false,
        error: 'User creation failed',
      };
    }

    // 2. Wait a bit for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 3. Get the profile that was auto-created by the trigger
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return {
        success: false,
        error: 'Profile creation failed. Please contact support.',
      };
    }
    if (!profile) {
      return {
        success: false,
        error: 'Profile was not created',
      };
    }

    // 4. Create the role-specific record (vendor or organizer)
    if (data.userType === 'vendor') {
      const { error: vendorError } = await supabase.from('vendors').insert({
        profile_id: profile.id,
        availability: 'available',
      });

      if (vendorError) {
        console.error('Vendor record creation error:', vendorError);
        return {
          success: false,
          error: 'Failed to create vendor profile',
        };
      }
    } else if (data.userType === 'organizer') {
      const { error: organizerError } = await supabase.from('organizers').insert({
        profile_id: profile.id,
        organization_type: 'individual',
      });

      if (organizerError) {
        console.error('Organizer record creation error:', organizerError);
        return {
          success: false,
          error: 'Failed to create organizer profile',
        };
      }
    }

    return {
      success: true,
      user: authData.user,
      profile,
      userType: data.userType,
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred during signup',
    };
  }
}

/**
 * Log in an existing user
 */
export async function signIn(email: string, password: string) {
  try {
    // Trim and lowercase email
    const trimmedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      console.error('Supabase sign-in error:', error);
      return {
        success: false,
        error: error.message || 'Invalid login credentials',
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Login failed',
      };
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return {
        success: false,
        error: 'Failed to load user profile',
      };
    }

    return {
      success: true,
      user: data.user,
      profile,
      userType: profile.user_type,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred during login',
    };
  }
}

/**
 * Log out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user's profile
 */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile;
}

/**
 * Check if a vendor has completed KYC
 */
export async function checkVendorKYC(profileId: string) {
  try {
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('business_name, category, description, country, city')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      console.error('Error checking vendor KYC:', error);
      return false;
    }

    // Check if essential KYC fields are filled
    const hasCompletedKYC = !!(
      vendor?.business_name &&
      vendor?.category &&
      vendor?.description &&
      vendor?.country &&
      vendor?.city
    );

    return hasCompletedKYC;
  } catch (error) {
    console.error('Error in checkVendorKYC:', error);
    return false;
  }
}

/**
 * Get vendor details for the current user
 */
export async function getVendorDetails(profileId: string) {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (error) {
    console.error('Error fetching vendor details:', error);
    return null;
  }

  return vendor;
}

/**
 * Get organizer details for the current user
 */
export async function getOrganizerDetails(profileId: string) {
  const { data: organizer, error } = await supabase
    .from('organizers')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (error) {
    console.error('Error fetching organizer details:', error);
    return null;
  }

  return organizer;
}
