import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../lib/supabase';
import { Users, Plus, Search, UserPlus, UserMinus, User, X } from 'lucide-react';
import { toast } from 'sonner';
interface GroupsTabProps {
  courseId: string;
  userRole: UserRole;
  groupSize?: number;
}
interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  membersList: string[];
}
const GroupsTab: React.FC<GroupsTabProps> = ({
  courseId,
  userRole,
  groupSize = 4
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(groupSize.toString());
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query
        // This is just mock data for the example
        setGroups([{
          id: 1,
          name: 'Team Alpha',
          description: 'Working on the term project for software design',
          members: 3,
          maxMembers: 4,
          membersList: ['John Doe', 'Jane Smith', 'Alex Johnson']
        }, {
          id: 2,
          name: 'Database Wizards',
          description: 'Group for the database project',
          members: 4,
          maxMembers: 4,
          membersList: ['Emily Brown', 'Michael Lee', 'Sarah Wilson', 'David Miller']
        }, {
          id: 3,
          name: 'Algorithm Experts',
          description: 'Focusing on algorithm assignments',
          members: 2,
          maxMembers: 4,
          membersList: ['Robert Taylor', 'Lisa Moore']
        }]);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [courseId]);
  const handleCreateGroup = async () => {
    try {
      // In a real app, this would be an actual Supabase insert
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newGroup: Group = {
        id: groups.length + 1,
        name: groupName,
        description: groupDescription,
        members: 1,
        maxMembers: parseInt(maxMembers),
        membersList: ['You (Group Creator)']
      };
      setGroups([...groups, newGroup]);
      toast.success('Group created successfully');
      setShowCreateModal(false);
      setGroupName('');
      setGroupDescription('');
      setMaxMembers(groupSize.toString());
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };
  const handleJoinGroup = async (groupId: number) => {
    try {
      // In a real app, this would be an actual Supabase update
      // This is just a mock for the example
      await new Promise(resolve => setTimeout(resolve, 500));
      setGroups(groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members + 1,
            membersList: [...group.membersList, 'You']
          };
        }
        return group;
      }));
      toast.success('Joined group successfully');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    }
  };
  const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()) || group.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const canCreateGroup = userRole === 'ClassRep' || userRole === 'Lecturer' || userRole === 'Admin';
  const canManageMembers = userRole === 'ClassRep' || userRole === 'Lecturer' || userRole === 'Admin';
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-secondary-400" />
          </div>
          <input type="text" placeholder="Search groups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
        </div>
        {canCreateGroup && <button onClick={() => setShowCreateModal(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <Plus size={18} className="mr-2" />
            Create Group
          </button>}
      </div>
      {isLoading ? <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div> : filteredGroups.length === 0 ? <div className="bg-white dark:bg-secondary-800 rounded-xl p-8 text-center">
          <Users size={48} className="mx-auto text-secondary-400" />
          <h3 className="mt-4 text-lg font-medium text-secondary-900 dark:text-secondary-100">
            No groups found
          </h3>
          <p className="mt-2 text-secondary-500 dark:text-secondary-400">
            {searchQuery ? 'Try adjusting your search.' : 'There are no groups for this course yet.'}
          </p>
          {canCreateGroup && <button onClick={() => setShowCreateModal(true)} className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
              <Plus size={18} className="mr-2" />
              Create Group
            </button>}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => <div key={group.id} className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft overflow-hidden">
              <div className="bg-primary-600 p-4">
                <h3 className="text-lg font-semibold text-white">
                  {group.name}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-secondary-600 dark:text-secondary-400">
                  {group.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-secondary-500 dark:text-secondary-400">
                    <span className="font-medium">
                      {group.members}/{group.maxMembers}
                    </span>{' '}
                    members
                  </div>
                  {userRole === 'Student' && <button onClick={() => handleJoinGroup(group.id)} disabled={group.members >= group.maxMembers} className={`px-3 py-1 text-sm font-medium rounded-lg ${group.members >= group.maxMembers ? 'bg-secondary-200 text-secondary-500 dark:bg-secondary-700 dark:text-secondary-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                      {group.members >= group.maxMembers ? 'Full' : 'Join'}
                    </button>}
                  {canManageMembers && <button className="px-3 py-1 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                      Manage
                    </button>}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Members:
                  </h4>
                  <div className="space-y-1">
                    {group.membersList.map((member, index) => <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                              {member[0]}
                            </span>
                          </div>
                          <span className="text-secondary-700 dark:text-secondary-300">
                            {member}
                          </span>
                        </div>
                        {canManageMembers && index > 0 && <button className="text-red-500 hover:text-red-600">
                            <UserMinus size={16} />
                          </button>}
                      </div>)}
                  </div>
                </div>
              </div>
            </div>)}
        </div>}
      {/* Create Group Modal */}
      {showCreateModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  Create New Group
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Group Name *
                  </label>
                  <input type="text" id="groupName" value={groupName} onChange={e => setGroupName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="e.g., Team Alpha" required />
                </div>
                <div>
                  <label htmlFor="groupDescription" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Description
                  </label>
                  <textarea id="groupDescription" value={groupDescription} onChange={e => setGroupDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="Brief description of the group" />
                </div>
                <div>
                  <label htmlFor="maxMembers" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Maximum Members *
                  </label>
                  <select id="maxMembers" value={maxMembers} onChange={e => setMaxMembers(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" required>
                    {[2, 3, 4, 5, 6, 7, 8].map(size => <option key={size} value={size} selected={size === groupSize}>
                        {size} members
                      </option>)}
                  </select>
                  <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                    Lecturer's preferred group size: {groupSize} members
                  </p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                    Cancel
                  </button>
                  <button onClick={handleCreateGroup} disabled={!groupName} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default GroupsTab;