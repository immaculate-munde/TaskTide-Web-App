import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase, UserRole } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface UserWithRole extends User {
  role: UserRole;
  display_name?: string;
}

interface AuthContextType {
  user: UserWithRole | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signupWithEmail: (email: string, password: string, role: UserRole) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  signupWithGoogle: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch session & user profile on mount
  useEffect(() => {
    async function getSession() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          ...session.user,
          role: profile?.role || 'Student',
          display_name: profile?.display_name,
        });
      }

      setLoading(false);
    }

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          ...session.user,
          role: profile?.role || 'Student',
          display_name: profile?.display_name,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Email login
  const loginWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // Email signup
  const signupWithEmail = async (email: string, password: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (data?.user) {
      // Create user profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        role,
        display_name: email.split('@')[0],
      });
    }

    return { error };
  };

  // Google OAuth login/signup
  const loginWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signupWithGoogle = loginWithGoogle;

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    signupWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
