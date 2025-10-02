import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, BookOpen, FileText, MessageSquare, User, X, LogOut } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen
}) => {
  const {
    user,
    signOut
  } = useAuth();
  const navItems = [{
    name: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard size={20} />
  }, {
    name: 'Courses',
    path: '/courses',
    icon: <BookOpen size={20} />
  }, {
    name: 'Resources',
    path: '/resources',
    icon: <FileText size={20} />
  }, {
    name: 'Messages',
    path: '/messages',
    icon: <MessageSquare size={20} />
  }, {
    name: 'Profile',
    path: '/profile',
    icon: <User size={20} />
  }];
  return <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-secondary-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:w-64 flex-shrink-0`}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between px-4 py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TT</span>
              </div>
              <h1 className="ml-2 text-xl font-semibold text-primary-700 dark:text-primary-300">
                TaskTide
              </h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
              <X size={20} />
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map(item => <NavLink key={item.path} to={item.path} className={({
            isActive
          }) => `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700'}`} end={item.path === '/'}>
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>)}
          </nav>
          {/* User info and logout */}
          <div className="px-4 py-6 border-t border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center">
                  <span className="font-medium text-primary-700 dark:text-primary-300">
                    {user?.display_name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200 truncate">
                  {user?.display_name || user?.email}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                  {user?.role}
                </p>
              </div>
              <button onClick={signOut} className="ml-auto flex-shrink-0 p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200" title="Sign out">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default Sidebar;