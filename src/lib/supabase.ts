import { createClient } from '@supabase/supabase-js';
// Safely access environment variables with fallbacks
const getEnvVar = (key: string, fallback: string) => {
  try {
    // Check if import.meta.env exists (Vite environment)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key] || fallback;
    }
    // Fallback for other environments
    return fallback;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}, using fallback`);
    return fallback;
  }
};
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://your-supabase-url.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'your-anon-key');
// Add debug logging for Supabase initialization
console.log('Initializing Supabase client with URL:', supabaseUrl === 'https://your-supabase-url.supabase.co' ? 'Using fallback URL' : 'Using environment URL');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Role types
export type UserRole = 'Lecturer' | 'ClassRep' | 'Student' | 'Contractor' | 'Admin';
// Enhanced error handling helper
const handleAuthError = (error: any, actionName: string) => {
  console.error(`Authentication error during ${actionName}:`, error);
  // Check for network-related errors
  if (error.message === 'Failed to fetch') {
    return {
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection or try again later.'
      }
    };
  }
  return {
    error
  };
};
// Auth helper functions with improved error handling
export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  } catch (error) {
    return handleAuthError(error, 'email sign in');
  }
};
export const signUpWithEmail = async (email: string, password: string, role: UserRole) => {
  try {
    const {
      data,
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role
        }
      }
    });
    if (data.user && !error) {
      try {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          role: role,
          display_name: email.split('@')[0]
        });
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // Continue anyway since the user was created
      }
    }
    return {
      data,
      error
    };
  } catch (error) {
    return handleAuthError(error, 'email sign up');
  }
};
export const signInWithGoogle = async () => {
  try {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log('Google OAuth redirect URL:', redirectUrl);
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
  } catch (error) {
    return handleAuthError(error, 'Google sign in');
  }
};
export const signInWithApple = async () => {
  try {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log('Apple OAuth redirect URL:', redirectUrl);
    return await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl
      }
    });
  } catch (error) {
    return handleAuthError(error, 'Apple sign in');
  }
};
export const signOut = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    return handleAuthError(error, 'sign out');
  }
};