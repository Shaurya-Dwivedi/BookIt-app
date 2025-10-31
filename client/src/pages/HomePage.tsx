// client/src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Experience } from '../types';

// Import Components
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
    <div className="bg-secondary min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {loading && <p className="text-center text-gray-500">Loading experiences...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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