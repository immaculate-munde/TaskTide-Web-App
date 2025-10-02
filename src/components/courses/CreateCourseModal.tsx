import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../lib/supabase';
interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}
const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  userRole
}) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [groupSize, setGroupSize] = useState('4');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLecturer = userRole === 'Lecturer';
  const modalTitle = isLecturer ? 'Create New Course' : 'Log New Unit';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app, this would be an actual Supabase insert
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${isLecturer ? 'Course created' : 'Unit logged'} successfully`);
      onClose();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(`Failed to ${isLecturer ? 'create course' : 'log unit'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-75" onClick={onClose}></div>
        <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              {modalTitle}
            </h3>
            <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="courseCode" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Course/Unit Code *
              </label>
              <input type="text" id="courseCode" value={courseCode} onChange={e => setCourseCode(e.target.value)} className="mt-1 block w-full px-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="e.g., CS101" required />
            </div>
            <div>
              <label htmlFor="courseTitle" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Course/Unit Title *
              </label>
              <input type="text" id="courseTitle" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} className="mt-1 block w-full px-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="e.g., Introduction to Computer Science" required />
            </div>
            <div>
              <label htmlFor="lecturer" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Lecturer *
              </label>
              <input type="text" id="lecturer" value={lecturer} onChange={e => setLecturer(e.target.value)} className="mt-1 block w-full px-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="e.g., Dr. Smith" required disabled={isLecturer} />
            </div>
            <div>
              <label htmlFor="groupSize" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Preferred Group Size *
              </label>
              <select id="groupSize" value={groupSize} onChange={e => setGroupSize(e.target.value)} className="mt-1 block w-full px-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" required>
                {[2, 3, 4, 5, 6, 7, 8].map(size => <option key={size} value={size}>
                    {size} students
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Description
              </label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="Brief description of the course/unit" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? <>
                    <span className="inline-block mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </> : isLecturer ? 'Create Course' : 'Log Unit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default CreateCourseModal;