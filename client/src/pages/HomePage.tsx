import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Experience } from '../types';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';

function HomePage() {
  useEffect(() => {
    document.title = 'BookIt - Browse Experiences';
  }, []);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/experiences');
        setExperiences(response.data);
        setFilteredExperiences(response.data);
      } catch (err) {
        setError('Failed to fetch experiences.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const filtered = experiences.filter((exp) =>
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.location.toLowerCase().includes(query.toLowerCase()) ||
      exp.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredExperiences(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={handleSearch} />

      <main className="px-4 sm:px-6 md:px-8 lg:px-[124px] py-8 md:py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-center text-gray-500 mt-4">Loading experiences...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-primary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">No experiences available at the moment.</p>
            <p className="text-gray-400">Check back soon for new adventures!</p>
          </div>
        )}

        {!loading && !error && experiences.length > 0 && (
          <>
            {searchQuery && (
              <div className="mb-4">
                <p className="text-gray-600">
                  {filteredExperiences.length} result{filteredExperiences.length !== 1 ? 's' : ''} found for "{searchQuery}"
                  {filteredExperiences.length !== experiences.length && (
                    <button 
                      onClick={() => handleSearch('')} 
                      className="ml-2 text-primary hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </p>
              </div>
            )}
            {filteredExperiences.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-2">No experiences match your search.</p>
                <button 
                  onClick={() => handleSearch('')} 
                  className="mt-4 bg-primary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
                {filteredExperiences.map((exp) => (
                  <ExperienceCard key={exp._id} experience={exp} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default HomePage;
