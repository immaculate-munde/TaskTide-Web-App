import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase, UserRole } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
interface UserWithRole extends User {
  role: UserRole;
  display_name?: string;
}
interface AuthContextType {
  user: UserWithRole | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getSession() {
      setLoading(true);
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        const {
          data: profile
        } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser({
          ...session.user,
          role: profile?.role || 'Student',
          display_name: profile?.display_name
        });
      }
      setLoading(false);
    }
    getSession();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        const {
          data: profile
        } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser({
          ...session.user,
          role: profile?.role || 'Student',
          display_name: profile?.display_name
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const value = {
    user,
    session,
    loading,
    signOut: async () => await supabase.auth.signOut()
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