import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { UserPlus, Mail, Lock, ArrowLeft, User } from "lucide-react";
import { UserRole } from "../lib/supabase";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signupWithEmail, signupWithGoogle } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signupWithEmail(email, password, role);
    if (error) {
      toast.error(error.message || "Signup failed");
      console.error("Signup error:", error);
    } else {
      toast.success("✅ Account created! Check your email to confirm.");
      navigate("/login");
    }
    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const { error } = await signupWithGoogle();
    if (error) {
      toast.error(error.message || "Google signup failed");
      console.error("Google signup error:", error);
    }
    setIsLoading(false);
  };

  const roles: UserRole[] = ["Lecturer", "ClassRep", "Student", "Contractor", "Admin"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-800 p-8 rounded-2xl shadow-soft">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">TT</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Join TaskTide
          </h2>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Create your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
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

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium">
                Select your role
              </label>
              <div className="mt-1 relative">
                <User className="absolute inset-y-0 left-0 ml-3 my-auto text-secondary-400" size={18} />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-10 py-3 rounded-xl border bg-white dark:bg-secondary-700"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex justify-center">
            <span className="px-2 text-sm text-secondary-500 bg-white dark:bg-secondary-800">
              Or continue with
            </span>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-xl border bg-white dark:bg-secondary-700 disabled:opacity-50"
            >
              Google
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              <ArrowLeft size={16} className="inline-block mr-1" /> Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
