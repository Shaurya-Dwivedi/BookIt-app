import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Experience } from '../types';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';

function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/experiences');
        setExperiences(response.data);
      } catch (err) {
        setError('Failed to fetch experiences.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="px-8 lg:px-[124px] py-12">
        {loading && <p className="text-center text-gray-500">Loading experiences...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {experiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
