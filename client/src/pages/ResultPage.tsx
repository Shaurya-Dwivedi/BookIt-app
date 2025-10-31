// client/src/pages/ResultPage.tsx
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const bookingRef = searchParams.get('ref');
  
  useEffect(() => {
    document.title = 'Booking Confirmed - BookIt';
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto flex flex-col items-center justify-center text-center py-20">
        <CheckCircle className="text-green-500" size={80} />
        <h1 className="text-4xl font-bold mt-6">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600 mt-2">
            Thank you for your booking. Your confirmation details are below.
        </p>
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <p className="text-sm text-gray-500">REFERENCE ID</p>
            <p className="text-2xl font-mono font-bold tracking-widest">{bookingRef || 'N/A'}</p>
        </div>
        <Link to="/">
            <button className="bg-primary font-bold py-3 px-6 mt-8 rounded-lg">
                Back to Home
            </button>
        </Link>
    </main>
    </>
  );
};

export default ResultPage;