import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Book, FileText, Calendar, MessageSquare, Users, Bell, ChevronLeft, Plus } from 'lucide-react';
import ResourcesTab from '../components/courses/ResourcesTab';
import EventsTab from '../components/courses/EventsTab';
import GroupsTab from '../components/courses/GroupsTab';
import ChatTab from '../components/courses/ChatTab';
import AnnouncementsTab from '../components/courses/AnnouncementsTab';
type TabType = 'resources' | 'events' | 'groups' | 'chat' | 'announcements';
const CourseDetail: React.FC = () => {
  const {
    courseId
  } = useParams<{
    courseId: string;
  }>();
  const {
    user
  } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('resources');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query
        // This is just mock data for the example
        setCourse({
          id: parseInt(courseId),
          code: 'CS101',
          title: 'Introduction to Computer Science',
          lecturer: 'Dr. Smith',
          groupSize: 4,
          description: 'Fundamental concepts of computer science and programming.',
          students: 45
        });
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);
  const tabs = [{
    id: 'resources',
    label: 'Resources',
    icon: <FileText size={18} />
  }, {
    id: 'events',
    label: 'Events',
    icon: <Calendar size={18} />
  }, {
    id: 'groups',
    label: 'Groups',
    icon: <Users size={18} />
  }, {
    id: 'chat',
    label: 'Chat',
    icon: <MessageSquare size={18} />
  }, {
    id: 'announcements',
    label: 'Announcements',
    icon: <Bell size={18} />
  }];
  const renderTabContent = () => {
    switch (activeTab) {
      case 'resources':
        return <ResourcesTab courseId={courseId} userRole={user?.role} />;
      case 'events':
        return <EventsTab courseId={courseId} userRole={user?.role} />;
      case 'groups':
        return <GroupsTab courseId={courseId} userRole={user?.role} groupSize={course?.groupSize} />;
      case 'chat':
        return <ChatTab courseId={courseId} userRole={user?.role} />;
      case 'announcements':
        return <AnnouncementsTab courseId={courseId} userRole={user?.role} />;
      default:
        return null;
    }
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
      </div>;
  }
  if (!course) {
    return <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 text-center">
        <Book size={48} className="mx-auto text-secondary-400" />
        <h3 className="mt-4 text-lg font-medium text-secondary-900 dark:text-secondary-100">
          Course not found
        </h3>
        <p className="mt-2 text-secondary-500 dark:text-secondary-400">
          The course you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <Link to="/courses" className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
          <ChevronLeft size={18} className="mr-2" />
          Back to Courses
        </Link>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link to="/courses" className="text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 mr-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          {course.code}: {course.title}
        </h1>
      </div>
      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft overflow-hidden">
        <div className="bg-primary-600 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {course.title}
              </h2>
              <p className="text-primary-200 mt-1">{course.lecturer}</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <span className="bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                {course.code}
              </span>
              <span className="bg-primary-800 text-primary-200 px-3 py-1 rounded-full text-sm font-medium">
                {course.students} students
              </span>
            </div>
          </div>
          <p className="text-primary-100 mt-4">{course.description}</p>
        </div>
        <div className="border-b border-secondary-200 dark:border-secondary-700">
          <nav className="flex overflow-x-auto">
            {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'}`}>
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>)}
          </nav>
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>;
};
export default CourseDetail;