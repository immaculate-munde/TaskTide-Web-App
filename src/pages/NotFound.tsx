import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
const NotFound: React.FC = () => {
  return <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4 text-center">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-secondary-900 dark:text-secondary-100">
        Page not found
      </h2>
      <p className="mt-2 text-lg text-secondary-600 dark:text-secondary-400">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-8 inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700">
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>
    </div>;
};
export default NotFound;