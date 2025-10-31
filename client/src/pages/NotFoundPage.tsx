// client/src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <button className="flex items-center gap-2 bg-primary text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
              <Home size={20} />
              Back to Home
            </button>
          </Link>
          <Link to="/">
            <button className="flex items-center gap-2 bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
              <Search size={20} />
              Browse Experiences
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
