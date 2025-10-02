import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { UserRole } from '../lib/supabase';
import { User, Mail, Phone, Key, Shield, LogOut, Save, X } from 'lucide-react';
import { toast } from 'sonner';
const Profile: React.FC = () => {
  const {
    user,
    signOut
  } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setEmail(user.email || '');
      setRole(user.role || 'Student');
      // Phone number would be fetched from the profile in a real app
      setPhoneNumber('');
    }
  }, [user]);
  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // In a real app, this would be an actual Supabase update
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      // In a real app, this would be an actual Supabase update
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };
  const isAdmin = user?.role === 'Admin';
  return <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
        My Profile
      </h1>
      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft overflow-hidden">
        <div className="bg-primary-600 p-6">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white dark:bg-secondary-800 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary-600">
                {displayName?.[0] || email?.[0] || 'U'}
              </span>
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-white">
                {displayName || email}
              </h2>
              <p className="text-primary-200">{role}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
                Profile Information
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center text-secondary-700 dark:text-secondary-300">
                      <User size={18} className="mr-2" />
                      <span>Display Name</span>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 mt-2 md:mt-0">
                    {isEditing ? <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" /> : <p className="text-secondary-900 dark:text-secondary-100">
                        {displayName || 'Not set'}
                      </p>}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center text-secondary-700 dark:text-secondary-300">
                      <Mail size={18} className="mr-2" />
                      <span>Email</span>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 mt-2 md:mt-0">
                    <p className="text-secondary-900 dark:text-secondary-100">
                      {email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center text-secondary-700 dark:text-secondary-300">
                      <Phone size={18} className="mr-2" />
                      <span>Phone Number</span>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 mt-2 md:mt-0">
                    {isEditing ? <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="+1 (123) 456-7890" /> : <p className="text-secondary-900 dark:text-secondary-100">
                        {phoneNumber || 'Not set'}
                      </p>}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center text-secondary-700 dark:text-secondary-300">
                      <Shield size={18} className="mr-2" />
                      <span>Role</span>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 mt-2 md:mt-0">
                    {isEditing && isAdmin ? <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100">
                        <option value="Student">Student</option>
                        <option value="ClassRep">Class Rep</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Admin">Admin</option>
                      </select> : <p className="text-secondary-900 dark:text-secondary-100">
                        {role}
                      </p>}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                {isEditing ? <div className="space-x-3">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600">
                      Cancel
                    </button>
                    <button onClick={handleUpdateProfile} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? <>
                          <span className="inline-block mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Saving...
                        </> : <>
                          <Save size={16} className="inline-block mr-2" />
                          Save Changes
                        </>}
                    </button>
                  </div> : <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700">
                    Edit Profile
                  </button>}
              </div>
            </div>
            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
                Security
              </h3>
              {isChangingPassword ? <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      New Password
                    </label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      Confirm New Password
                    </label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button onClick={() => {
                  setIsChangingPassword(false);
                  setPassword('');
                  setConfirmPassword('');
                }} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600">
                      Cancel
                    </button>
                    <button onClick={handleChangePassword} disabled={isLoading || !password || password !== confirmPassword} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div> : <button onClick={() => setIsChangingPassword(true)} className="flex items-center text-primary-600 hover:text-primary-500">
                  <Key size={18} className="mr-2" />
                  Change Password
                </button>}
            </div>
            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
              <button onClick={signOut} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                <LogOut size={18} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Profile;