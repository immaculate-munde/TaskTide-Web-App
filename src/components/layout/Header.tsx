import React from 'react';
import { Menu, Bell, MoonStar, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
interface HeaderProps {
  toggleSidebar: () => void;
}
const Header: React.FC<HeaderProps> = ({
  toggleSidebar
}) => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  return <header className="bg-white dark:bg-secondary-800 shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <button onClick={toggleSidebar} className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200 md:hidden">
          <Menu size={24} />
        </button>
        <div className="flex-1 md:ml-8">
          <h2 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 md:block hidden">
            TaskTide
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent-500"></span>
          </button>
          <button onClick={toggleTheme} className="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200">
            {theme === 'dark' ? <Sun size={20} /> : <MoonStar size={20} />}
          </button>
        </div>
      </div>
    </header>;
};
export default Header;