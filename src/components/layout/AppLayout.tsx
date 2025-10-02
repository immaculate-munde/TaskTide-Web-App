import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="flex h-screen bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-secondary-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>;
};
export default AppLayout;