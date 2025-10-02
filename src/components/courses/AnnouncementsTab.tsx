import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../lib/supabase';
import { Bell, Plus, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
interface AnnouncementsTabProps {
  courseId: string;
  userRole: UserRole;
}
interface Announcement {
  id: number;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  important: boolean;
}
const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  courseId,
  userRole
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query
        // This is just mock data for the example
        setAnnouncements([{
          id: 1,
          title: 'Midterm Exam Date Changed',
          content: 'Due to scheduling conflicts, the midterm exam has been moved to November 15th. The exam will cover all material from weeks 1-6.',
          createdBy: 'Dr. Smith',
          createdAt: '2023-11-01T10:00:00Z',
          important: true
        }, {
          id: 2,
          title: 'Assignment 2 Posted',
          content: 'Assignment 2 has been posted on the resources page. It is due on November 10th at 11:59 PM.',
          createdBy: 'Dr. Smith',
          createdAt: '2023-10-28T14:30:00Z',
          important: false
        }, {
          id: 3,
          title: 'Guest Lecture Next Week',
          content: 'We will have a guest lecturer from Industry Inc. next Tuesday. Attendance is highly encouraged as the material will be included in the final exam.',
          createdBy: 'Dr. Smith',
          createdAt: '2023-10-25T09:15:00Z',
          important: false
        }]);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, [courseId]);
  const handleCreateAnnouncement = async () => {
    try {
      // In a real app, this would be an actual Supabase insert
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newAnnouncement: Announcement = {
        id: announcements.length + 1,
        title: announcementTitle,
        content: announcementContent,
        createdBy: userRole === 'Lecturer' ? 'Dr. Smith' : 'Class Rep',
        createdAt: new Date().toISOString(),
        important: isImportant
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      toast.success('Announcement created successfully');
      setShowCreateModal(false);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setIsImportant(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    }
  };
  const canCreateAnnouncement = userRole === 'Lecturer' || userRole === 'ClassRep' || userRole === 'Admin';
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          Course Announcements
        </h2>
        {canCreateAnnouncement && <button onClick={() => setShowCreateModal(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <Plus size={18} className="mr-2" />
            New Announcement
          </button>}
      </div>
      {isLoading ? <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div> : announcements.length === 0 ? <div className="bg-white dark:bg-secondary-800 rounded-xl p-8 text-center">
          <Bell size={48} className="mx-auto text-secondary-400" />
          <h3 className="mt-4 text-lg font-medium text-secondary-900 dark:text-secondary-100">
            No announcements yet
          </h3>
          <p className="mt-2 text-secondary-500 dark:text-secondary-400">
            There are no announcements for this course yet.
          </p>
          {canCreateAnnouncement && <button onClick={() => setShowCreateModal(true)} className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
              <Plus size={18} className="mr-2" />
              New Announcement
            </button>}
        </div> : <div className="space-y-4">
          {announcements.map(announcement => <div key={announcement.id} className={`bg-white dark:bg-secondary-800 rounded-xl shadow-soft p-6 ${announcement.important ? 'border-l-4 border-red-500' : ''}`}>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 flex items-center">
                  {announcement.important && <AlertCircle size={18} className="text-red-500 mr-2" />}
                  {announcement.title}
                </h3>
                <div className="text-sm text-secondary-500 dark:text-secondary-400">
                  {format(new Date(announcement.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              <p className="mt-2 text-secondary-600 dark:text-secondary-400 whitespace-pre-line">
                {announcement.content}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-secondary-500 dark:text-secondary-400">
                  Posted by {announcement.createdBy}
                </div>
                {canCreateAnnouncement && <button className="text-sm text-primary-600 hover:text-primary-500">
                    Edit
                  </button>}
              </div>
            </div>)}
        </div>}
      {/* Create Announcement Modal */}
      {showCreateModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  Create New Announcement
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="announcementTitle" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Title *
                  </label>
                  <input type="text" id="announcementTitle" value={announcementTitle} onChange={e => setAnnouncementTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="e.g., Midterm Exam Date Changed" required />
                </div>
                <div>
                  <label htmlFor="announcementContent" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Content *
                  </label>
                  <textarea id="announcementContent" value={announcementContent} onChange={e => setAnnouncementContent(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="Enter the announcement content..." required />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="isImportant" checked={isImportant} onChange={e => setIsImportant(e.target.checked)} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-secondary-600 rounded bg-white dark:bg-secondary-700" />
                  <label htmlFor="isImportant" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                    Mark as important
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                    Cancel
                  </button>
                  <button onClick={handleCreateAnnouncement} disabled={!announcementTitle || !announcementContent} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Publish Announcement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default AnnouncementsTab;