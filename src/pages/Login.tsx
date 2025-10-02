import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signInWithEmail, signInWithGoogle, signInWithApple } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Phone } from 'lucide-react';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const {
        error
      } = await signInWithEmail(email, password);
      if (error) {
        toast.error(error.message);
        console.error('Login error details:', error);
      } else {
        toast.success('Logged in successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const {
        error
      } = await signInWithGoogle();
      if (error) {
        toast.error(error.message);
        console.error('Google login error details:', error);
      }
    } catch (error) {
      console.error('Unexpected Google login error:', error);
      toast.error('An error occurred with Google login');
    }
  };
  const handleAppleLogin = async () => {
    try {
      const {
        error
      } = await signInWithApple();
      if (error) {
        toast.error(error.message);
        console.error('Apple login error details:', error);
      }
    } catch (error) {
      console.error('Unexpected Apple login error:', error);
      toast.error('An error occurred with Apple login');
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-800 p-8 rounded-2xl shadow-soft">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">TT</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Welcome to TaskTide
          </h2>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-secondary-400" />
                </div>
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-3 pl-10 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-secondary-400" />
                </div>
                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-3 pl-10 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-secondary-600 rounded bg-white dark:bg-secondary-700" />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span> : <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LogIn size={18} className="text-primary-300" />
                </span>}
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300 dark:border-secondary-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center py-3 px-4 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm bg-white dark:bg-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor" />
              </svg>
              <span className="ml-2">Google</span>
            </button>
            <button onClick={handleAppleLogin} className="w-full inline-flex justify-center py-3 px-4 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm bg-white dark:bg-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152,6.896c-0.948,0-2.415-1.078-3.96-1.04c-2.04,0.027-3.91,1.183-4.961,3.014c-2.117,3.675-0.546,9.103,1.519,12.09c1.013,1.454,2.208,3.09,3.792,3.039c1.52-0.065,2.09-0.987,3.935-0.987c1.831,0,2.35,0.987,3.96,0.948c1.637-0.026,2.676-1.48,3.676-2.948c1.156-1.688,1.636-3.325,1.662-3.415c-0.035-0.013-3.182-1.258-3.22-4.921c-0.026-3.078,2.506-4.547,2.623-4.623c-1.454-2.091-3.688-2.325-4.481-2.377C14.66,5.641,13.14,6.896,12.152,6.896z M15.629,3.809c0.838-1.013,1.403-2.427,1.245-3.83c-1.207,0.052-2.662,0.805-3.532,1.818c-0.78,0.896-1.454,2.338-1.273,3.714C13.391,5.598,14.793,4.82,15.629,3.809z" />
              </svg>
              <span className="ml-2">Apple</span>
            </button>
            <button className="w-full inline-flex justify-center py-3 px-4 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm bg-white dark:bg-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-600">
              <Phone size={18} />
              <span className="ml-2">Phone</span>
            </button>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 inline-flex items-center">
              Sign up <ArrowRight size={16} className="ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>;
};
export default Login;