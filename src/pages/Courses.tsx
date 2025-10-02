import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Book, Users, Calendar, Plus, Search, Filter } from 'lucide-react';
import CreateCourseModal from '../components/courses/CreateCourseModal';
const Courses: React.FC = () => {
  const {
    user
  } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query
        // This is just mock data for the example
        setCourses([{
          id: 1,
          code: 'CS101',
          title: 'Introduction to Computer Science',
          lecturer: 'Dr. Smith',
          groupSize: 4,
          description: 'Fundamental concepts of computer science and programming.',
          students: 45
        }, {
          id: 2,
          code: 'WD200',
          title: 'Web Development',
          lecturer: 'Prof. Johnson',
          groupSize: 3,
          description: 'Learn modern web development techniques and frameworks.',
          students: 32
        }, {
          id: 3,
          code: 'DB303',
          title: 'Database Systems',
          lecturer: 'Dr. Williams',
          groupSize: 4,
          description: 'Design and implementation of database systems and applications.',
          students: 28
        }, {
          id: 4,
          code: 'SE400',
          title: 'Software Engineering',
          lecturer: 'Prof. Brown',
          groupSize: 5,
          description: 'Software development methodologies and project management.',
          students: 37
        }]);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [user]);
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterOption === 'all') {
      return matchesSearch;
    }
    // Additional filter options could be implemented here
    return matchesSearch;
  });
  const canCreateCourse = user?.role === 'Lecturer' || user?.role === 'ClassRep' || user?.role === 'Admin';
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          My Courses
        </h1>
        {canCreateCourse && <button onClick={() => setShowCreateModal(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <Plus size={18} className="mr-2" />
            {user?.role === 'Lecturer' ? 'Create Course' : 'Log Unit'}
          </button>}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-secondary-400" />
          </div>
          <input type="text" placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
        </div>
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-secondary-400" />
          </div>
          <select value={filterOption} onChange={e => setFilterOption(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100">
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      {isLoading ? <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div> : <>
          {filteredCourses.length === 0 ? <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 text-center">
              <Book size={48} className="mx-auto text-secondary-400" />
              <h3 className="mt-4 text-lg font-medium text-secondary-900 dark:text-secondary-100">
                No courses found
              </h3>
              <p className="mt-2 text-secondary-500 dark:text-secondary-400">
                {searchQuery ? 'Try adjusting your search or filter options.' : 'You are not enrolled in any courses yet.'}
              </p>
              {canCreateCourse && <button onClick={() => setShowCreateModal(true)} className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  <Plus size={18} className="mr-2" />
                  {user?.role === 'Lecturer' ? 'Create Course' : 'Log Unit'}
                </button>}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => <Link key={course.id} to={`/courses/${course.id}`} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow overflow-hidden flex flex-col">
                  <div className="h-24 bg-primary-600 p-6 flex items-center">
                    <div className="bg-white dark:bg-secondary-800 rounded-lg h-12 w-12 flex items-center justify-center">
                      <Book size={24} className="text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-white">
                        {course.code}
                      </h3>
                      <p className="text-primary-200">{course.lecturer}</p>
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                      <Users size={16} className="mr-1" />
                      <span>{course.students} students</span>
                      <span className="mx-2">•</span>
                      <span>Groups of {course.groupSize}</span>
                    </div>
                  </div>
                </Link>)}
            </div>}
        </>}
      {showCreateModal && <CreateCourseModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} userRole={user?.role} />}
    </div>;
};
export default Courses;