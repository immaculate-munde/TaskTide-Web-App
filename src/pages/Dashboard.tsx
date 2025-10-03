// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Calendar,
  Clock,
  CheckCircle,
  Book,
  Users,
  User,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';

interface Class {
  id: number;
  name: string;
  time: string;
  location: string;
}

interface Deadline {
  id: number;
  title: string;
  course: string;
  dueDate: string;
}

interface Group {
  id: number;
  name: string;
  course: string;
  members: number;
  maxMembers: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [todayClasses, setTodayClasses] = useState<Class[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Deadline[]>([]);
  const [activeGroups, setActiveGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Attempt to fetch real user profile
        if (user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.warn('No profile found, using mock data:', profileError.message);
          } else {
            console.log('User profile fetched:', profile);
            // You can extend to fetch actual classes, deadlines, groups here
          }
        }

        // Mock data fallback
        setTodayClasses([
          { id: 1, name: 'Introduction to Computer Science', time: '09:00 - 10:30', location: 'Room 101' },
          { id: 2, name: 'Web Development', time: '13:00 - 14:30', location: 'Lab 3' },
        ]);

        setUpcomingDeadlines([
          { id: 1, title: 'Submit Project Proposal', course: 'Software Engineering', dueDate: '2023-11-15' },
          { id: 2, title: 'Complete Quiz', course: 'Database Systems', dueDate: '2023-11-10' },
          { id: 3, title: 'Group Presentation', course: 'Web Development', dueDate: '2023-11-20' },
        ]);

        setActiveGroups([
          { id: 1, name: 'Team Alpha', course: 'Software Engineering', members: 3, maxMembers: 4 },
          { id: 2, name: 'Web Warriors', course: 'Web Development', members: 4, maxMembers: 4 },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Welcome, {user?.display_name || 'User'}
        </h1>
        <div className="text-sm text-secondary-500 dark:text-secondary-400">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center">
                <Calendar size={20} className="mr-2 text-primary-500" />
                Today's Classes
              </h2>
              <Link to="/courses" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            {todayClasses.length === 0 ? (
              <p className="text-secondary-500 dark:text-secondary-400">No classes scheduled for today.</p>
            ) : (
              <div className="space-y-4">
                {todayClasses.map((cls) => (
                  <div key={cls.id} className="flex items-start border-l-4 border-primary-500 pl-4 py-1">
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900 dark:text-secondary-100">{cls.name}</h3>
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                        <Clock size={14} className="mr-1" />
                        {cls.time} <span className="mx-2">•</span> {cls.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center">
                <CheckCircle size={20} className="mr-2 text-accent-500" />
                Upcoming Deadlines
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-500">Add Task</button>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-secondary-500 dark:text-secondary-400">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900 dark:text-secondary-100">{deadline.title}</h3>
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                        <Book size={14} className="mr-1" />
                        {deadline.course} <span className="mx-2">•</span> Due{' '}
                        {format(new Date(deadline.dueDate), 'MMM d')}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          new Date(deadline.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                            ? 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {new Date(deadline.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                          ? 'Soon'
                          : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Groups */}
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center">
                <Users size={20} className="mr-2 text-primary-500" />
                Active Groups
              </h2>
              <Link to="/courses" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            {activeGroups.length === 0 ? (
              <p className="text-secondary-500 dark:text-secondary-400">You are not part of any groups.</p>
            ) : (
              <div className="space-y-4">
                {activeGroups.map((group) => (
                  <div key={group.id} className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900 dark:text-secondary-100">{group.name}</h3>
                      <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                        <Book size={14} className="mr-1" /> {group.course}{' '}
                        <span className="mx-2">•</span> <Users size={14} className="mr-1" />{' '}
                        {group.members}/{group.maxMembers} members
                      </div>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          group.members === group.maxMembers
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {group.members === group.maxMembers ? 'Full' : 'Open'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Link
            to="/courses"
            className="flex flex-col items-center justify-center p-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
          >
            <Book size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">My Courses</span>
          </Link>
          <Link
            to="/resources"
            className="flex flex-col items-center justify-center p-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
          >
            <FileText size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Resources</span>
          </Link>
          <Link
            to="/messages"
            className="flex flex-col items-center justify-center p-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
          >
            <MessageSquare size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Messages</span>
          </Link>
          <button className="flex flex-col items-center justify-center p-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
            <Calendar size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Calendar</span>
          </button>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center p-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
          >
            <User size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
