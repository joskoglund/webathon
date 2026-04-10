import React from 'react';
import { MoveLeft, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // Or your specific router link

const NotFound: React.FC = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Decorative Badge */}
        <p className="text-base font-semibold text-indigo-600">404</p>
        
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-base leading-7 text-gray-600 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          {/* Main Action */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95"
          >
            <MoveLeft size={18} />
            Back to home
          </Link>
          
          {/* Secondary Action */}
          <Link 
            to="/support" 
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            <HelpCircle size={18} />
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;