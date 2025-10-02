import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../lib/supabase';
import { File, FileText, Image, FileArchive, Download, Upload, Eye, Plus, Search, Folder } from 'lucide-react';
import { toast } from 'sonner';
interface ResourcesTabProps {
  courseId: string;
  userRole: UserRole;
}
interface Resource {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}
const ResourcesTab: React.FC<ResourcesTabProps> = ({
  courseId,
  userRole
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2023-10-15',
          url: '#'
        }, {
          id: 2,
          name: 'Week 1 Slides.pptx',
          type: 'pptx',
          size: '5.1 MB',
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2023-10-15',
          url: '#'
        }, {
          id: 3,
          name: 'Assignment 1 Instructions.docx',
          type: 'docx',
          size: '1.2 MB',
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2023-10-17',
          url: '#'
        }, {
          id: 4,
          name: 'Course Syllabus.pdf',
          type: 'pdf',
          size: '0.9 MB',
          uploadedBy: 'Dr. Smith',
          uploadedAt: '2023-10-10',
          url: '#'
        }]);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [courseId]);
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      // In a real app, this would be an actual Supabase storage upload
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('File uploaded successfully');
      setShowUploadModal(false);
      setSelectedFile(null);
      // Add the new file to the resources list
      const newResource = {
        id: resources.length + 1,
        name: selectedFile.name,
        type: selectedFile.name.split('.').pop() || '',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: userRole === 'Lecturer' ? 'Dr. Smith' : 'Class Rep',
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
  const filteredResources = resources.filter(resource => resource.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const canUpload = userRole === 'Lecturer' || userRole === 'ClassRep' || userRole === 'Admin';
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-secondary-400" />
          </div>
          <input type="text" placeholder="Search resources..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
        </div>
        {canUpload && <button onClick={() => setShowUploadModal(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <Upload size={18} className="mr-2" />
            Upload Resource
          </button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary-50 dark:bg-secondary-700 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <Folder size={20} className="text-primary-500 mr-2" />
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
              Lecture Materials
            </h3>
          </div>
          {isLoading ? <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div> : filteredResources.length === 0 ? <div className="text-center py-8">
              <p className="text-secondary-500 dark:text-secondary-400">
                No resources found
              </p>
            </div> : <div className="space-y-2">
              {filteredResources.filter(r => r.name.includes('Lecture')).map(resource => <div key={resource.id} className="flex items-center justify-between p-3 bg-white dark:bg-secondary-800 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-750 transition-colors">
                    <div className="flex items-center">
                      {getFileIcon(resource.type)}
                      <div className="ml-3">
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          {resource.name}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          {resource.size} • Uploaded by {resource.uploadedBy} on{' '}
                          {resource.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200" title="Download">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>)}
            </div>}
        </div>
        <div className="bg-secondary-50 dark:bg-secondary-700 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <Folder size={20} className="text-primary-500 mr-2" />
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
              Course Materials
            </h3>
          </div>
          {isLoading ? <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div> : filteredResources.filter(r => !r.name.includes('Lecture')).length === 0 ? <div className="text-center py-8">
              <p className="text-secondary-500 dark:text-secondary-400">
                No resources found
              </p>
            </div> : <div className="space-y-2">
              {filteredResources.filter(r => !r.name.includes('Lecture')).map(resource => <div key={resource.id} className="flex items-center justify-between p-3 bg-white dark:bg-secondary-800 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-750 transition-colors">
                    <div className="flex items-center">
                      {getFileIcon(resource.type)}
                      <div className="ml-3">
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          {resource.name}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          {resource.size} • Uploaded by {resource.uploadedBy} on{' '}
                          {resource.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200" title="Download">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>)}
            </div>}
        </div>
      </div>
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
                  <button onClick={handleFileUpload} disabled={!selectedFile} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
import { X } from 'lucide-react';
export default ResourcesTab;