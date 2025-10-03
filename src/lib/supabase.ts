// src/lib/supabase.ts
import { createClient, Session, User } from '@supabase/supabase-js'

// ✅ Load environment variables (from Vite `.env`)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Debugging logs (only in dev mode)
if (import.meta.env.DEV) {
  console.log("🔑 Supabase URL:", supabaseUrl || "❌ MISSING")
  console.log("🔑 Supabase Anon Key:", supabaseAnonKey ? "✅ Loaded" : "❌ MISSING")
}

// Fail-safe: throw error if missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase environment variables are missing. Check your .env file.")
}

// ✅ Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 🔹 User roles
export type UserRole = 'Lecturer' | 'ClassRep' | 'Student' | 'Contractor' | 'Admin'

// 🔹 Unified error handler
const handleAuthError = (error: any, actionName: string) => {
  console.error(`🚨 Auth error during ${actionName}:`, error)

  if (error?.message === 'Failed to fetch') {
    return {
      error: { message: '🌐 Network error: Could not connect to Supabase. Check internet or CORS settings.' }
    }
  }

  return { error }
}

// 🔹 Email/password sign-in
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { user: data.user, session: data.session, error }
  } catch (error) {
    return handleAuthError(error, 'email sign in')
  }
}

// 🔹 Email/password sign-up with profile insert
export const signUpWithEmail = async (email: string, password: string, role: UserRole) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    })

    if (data.user && !error) {
      try {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          role,
          display_name: email.split('@')[0]
        })
      } catch (profileError) {
        console.error('⚠️ Error creating user profile:', profileError)
      }
    }

    return { user: data.user, session: data.session, error }
  } catch (error) {
    return handleAuthError(error, 'email sign up')
  }
}

// 🔹 Google OAuth sign-in
export const signInWithGoogle = async () => {
  try {
    const redirectUrl = `${window.location.origin}/auth/callback`
    console.log('🔗 Google OAuth redirect URL:', redirectUrl)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl }
    })

    return { data, error }
  } catch (error) {
    return handleAuthError(error, 'Google sign in')
  }
}

// 🔹 Apple OAuth sign-in (optional)
export const signInWithApple = async () => {
  try {
    const redirectUrl = `${window.location.origin}/auth/callback`
    console.log('🔗 Apple OAuth redirect URL:', redirectUrl)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: redirectUrl }
    })

    return { data, error }
  } catch (error) {
    return handleAuthError(error, 'Apple sign in')
  }
}

// 🔹 Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return handleAuthError(error, 'sign out')
  }
}

// 🔹 Get current session
export const getSession = async (): Promise<{ session: Session | null, user: User | null }> => {
  const { data } = await supabase.auth.getSession()
  return { session: data.session, user: data.session?.user || null }
}
