import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user, loginWithEmail, loginWithGoogle } = useAuth()

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
  }, [user, navigate])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await loginWithEmail(email, password)
    if (error) {
      toast.error(error.message || 'Login failed')
      console.error('Login error:', error)
    } else {
      toast.success('✅ Logged in successfully')
      navigate('/app', { replace: true })
    }
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const { error } = await loginWithGoogle()
    if (error) {
      toast.error(error.message || 'Google login failed')
      console.error('Google login error:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-12 px-4 sm:px-6 lg:px-8">
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
                <Mail className="absolute inset-y-0 left-0 ml-3 my-auto text-secondary-400" size={18} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-3 rounded-xl border bg-white dark:bg-secondary-700"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute inset-y-0 left-0 ml-3 my-auto text-secondary-400" size={18} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 py-3 rounded-xl border bg-white dark:bg-secondary-700"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex justify-center text-sm text-secondary-500">
            Or continue with
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center mt-4 py-3 px-4 rounded-xl border bg-white dark:bg-secondary-700 disabled:opacity-50"
          >
            Google
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 inline-flex items-center">
              Sign up <ArrowRight size={16} className="ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
