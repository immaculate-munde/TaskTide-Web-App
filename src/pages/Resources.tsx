import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FileText, File, Image, FileArchive, Search, Filter, Upload, Download, Eye, Folder, X } from 'lucide-react';
import { toast } from 'sonner';
interface Resource {
  id: number;
  name: string;
  type: string;
  size: string;
  course: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}
const Resources: React.FC = () => {
  const {
    user
  } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query
        // This is just mock data for the example
        setResources([{
          id: 1,
          name: 'Lecture 1 - Introduction.pdf',
          type: 'pdf',
          size: '2.4 MB',
          course: 'CS101: Introduction to Computer Science',
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2023-10-15',
          url: '#'
        }, {
          id: 2,
          name: 'Week 1 Slides.pptx',
          type: 'pptx',
          size: '5.1 MB',
          course: 'CS101: Introduction to Computer Science',
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2023-10-15',
          url: '#'
        }, {
          id: 3,
          name: 'Assignment 1 Instructions.docx',
          type: 'docx',
          size: '1.2 MB',
          course: 'WD200: Web Development',
          uploadedBy: 'Prof. Johnson',
          uploadedAt: '2023-10-17',
          url: '#'
        }, {
          id: 4,
          name: 'Course Syllabus.pdf',
          type: 'pdf',
          size: '0.9 MB',
          course: 'CS101: Introduction to Computer Science',
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2023-10-10',
          url: '#'
        }, {
          id: 5,
          name: 'Database Schema Example.png',
          type: 'png',
          size: '1.7 MB',
          course: 'DB303: Database Systems',
          uploadedBy: 'Dr. Williams',
          uploadedAt: '2023-10-20',
          url: '#'
        }, {
          id: 6,
          name: 'Project Requirements.pdf',
          type: 'pdf',
          size: '3.2 MB',
          course: 'SE400: Software Engineering',
          uploadedBy: 'Prof. Brown',
          uploadedAt: '2023-10-18',
          url: '#'
        }]);
        setCourses([{
          id: 1,
          name: 'CS101: Introduction to Computer Science'
        }, {
          id: 2,
          name: 'WD200: Web Development'
        }, {
          id: 3,
          name: 'DB303: Database Systems'
        }, {
          id: 4,
          name: 'SE400: Software Engineering'
        }]);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);
  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCourse) return;
    try {
      // In a real app, this would be an actual Supabase storage upload
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('File uploaded successfully');
      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedCourse('');
      // Add the new file to the resources list
      const newResource = {
        id: resources.length + 1,
        name: selectedFile.name,
        type: selectedFile.name.split('.').pop() || '',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        course: selectedCourse,
        uploadedBy: user?.display_name || 'You',
        uploadedAt: new Date().toISOString().split('T')[0],
        url: '#'
      };
      setResources([...resources, newResource]);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-red-500" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <Image size={20} className="text-blue-500" />;
      case 'zip':
      case 'rar':
        return <FileArchive size={20} className="text-yellow-500" />;
      case 'pptx':
        return <FileText size={20} className="text-orange-500" />;
      case 'docx':
        return <FileText size={20} className="text-blue-500" />;
      default:
        return <File size={20} className="text-secondary-500" />;
    }
  };
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || resource.course.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterOption === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && resource.course.includes(filterOption);
    }
  });
  const courseOptions = ['all', ...new Set(resources.map(resource => resource.course))];
  const canUpload = user?.role === 'Lecturer' || user?.role === 'ClassRep' || user?.role === 'Admin';
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Resources
        </h1>
        {canUpload && <button onClick={() => setShowUploadModal(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <Upload size={18} className="mr-2" />
            Upload Resource
          </button>}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-secondary-400" />
          </div>
          <input type="text" placeholder="Search resources..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-secondary-400" />
          </div>
          <select value={filterOption} onChange={e => setFilterOption(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100">
            <option value="all">All Courses</option>
            {resources.map(resource => resource.course).filter((value, index, self) => self.indexOf(value) === index).map(course => <option key={course} value={course}>
                  {course}
                </option>)}
          </select>
        </div>
      </div>
      {isLoading ? <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div> : filteredResources.length === 0 ? <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 text-center">
          <FileText size={48} className="mx-auto text-secondary-400" />
          <h3 className="mt-4 text-lg font-medium text-secondary-900 dark:text-secondary-100">
            No resources found
          </h3>
          <p className="mt-2 text-secondary-500 dark:text-secondary-400">
            {searchQuery || filterOption !== 'all' ? 'Try adjusting your search or filter options.' : 'There are no resources available yet.'}
          </p>
          {canUpload && <button onClick={() => setShowUploadModal(true)} className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
              <Upload size={18} className="mr-2" />
              Upload Resource
            </button>}
        </div> : <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filteredResources.map(resource => <tr key={resource.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(resource.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {resource.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-700 dark:text-secondary-300">
                        {resource.course}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-700 dark:text-secondary-300">
                        {resource.uploadedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-700 dark:text-secondary-300">
                        {resource.uploadedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-700 dark:text-secondary-300">
                        {resource.size}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200" title="Download">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
      {/* Upload Modal */}
      {showUploadModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-75" onClick={() => setShowUploadModal(false)}></div>
            <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  Upload Resource
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Select Course *
                  </label>
                  <select id="course" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" required>
                    <option value="">Select a course</option>
                    {courses.map((course: any) => <option key={course.id} value={course.name}>
                        {course.name}
                      </option>)}
                  </select>
                </div>
                <div className="border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-xl p-6 text-center">
                  {selectedFile ? <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button onClick={() => setSelectedFile(null)} className="mt-2 text-sm text-primary-600 hover:text-primary-500">
                        Change file
                      </button>
                    </div> : <>
                      <Upload size={36} className="mx-auto text-secondary-400" />
                      <p className="mt-2 text-secondary-600 dark:text-secondary-400">
                        Drag and drop a file here, or click to select a file
                      </p>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }} />
                    </>}
                </div>
                <div className="flex justify-end space-x-3">
                  <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                    Cancel
                  </button>
                  <button onClick={handleFileUpload} disabled={!selectedFile || !selectedCourse} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default Resources;