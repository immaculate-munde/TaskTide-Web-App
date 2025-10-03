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
  due_date: string;
}

interface Group {
  id: number;
  name: string;
  course: string;
  members: number;
  max_members: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [todayClasses, setTodayClasses] = useState<Class[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Deadline[]>([]);
  const [activeGroups, setActiveGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        const today = format(new Date(), 'yyyy-MM-dd');

        // Fetch today's classes
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', today)
          .order('time', { ascending: true });

        if (classesError) throw classesError;
        setTodayClasses(classesData || []);

        // Fetch upcoming deadlines
        const { data: deadlinesData, error: deadlinesError } = await supabase
          .from('deadlines')
          .select('*')
          .eq('user_id', user.id)
          .gte('due_date', today)
          .order('due_date', { ascending: true });

        if (deadlinesError) throw deadlinesError;
        setUpcomingDeadlines(deadlinesData || []);

        // Fetch active groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .contains('user_ids', [user.id]); // array column
        if (groupsError) throw groupsError;
        setActiveGroups(groupsData || []);
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
                        {format(new Date(deadline.due_date), 'MMM d')}
                      </div>
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
                        <span className="mx-2">•</span> <Users size={14} className="mr-1" /> {group.members}/{group.max_members} members
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
