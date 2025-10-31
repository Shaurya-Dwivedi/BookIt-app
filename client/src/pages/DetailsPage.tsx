// client/src/pages/DetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { Experience, DateSlot, TimeSlot } from '../types';
import { ArrowLeft } from 'lucide-react'; // A nice icon library, let's install it
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useBooking } from '../context/BookingContext';

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate(); // For navigation
  const { setBookingDetails } = useBooking(); // To set global state
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for user selections ---
  const [selectedDate, setSelectedDate] = useState<DateSlot | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Calculate max quantity based on selected time slot
  const maxQuantity = selectedTime ? selectedTime.spotsLeft : 10;

  useEffect(() => {
    if (!id) return;
    const fetchExperience = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await axios.get(`${API_URL}/experiences/${id}`);
        setExperience(response.data);
        document.title = `${response.data.title} - BookIt`;
        // Pre-select the first available date
        if (response.data.availableSlots && response.data.availableSlots.length > 0) {
          setSelectedDate(response.data.availableSlots[0]);
        }
      } catch (err) {
        setError('Failed to fetch experience details.');
        document.title = 'Experience Details - BookIt';
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  // --- Helper function to format dates ---
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Reset quantity when time slot changes
  useEffect(() => {
    if (selectedTime && quantity > selectedTime.spotsLeft) {
      setQuantity(Math.min(quantity, selectedTime.spotsLeft));
    }
  }, [selectedTime]);

  // --- Price calculation ---
  const subtotal = experience ? experience.price * quantity : 0;
  const taxes = subtotal * 0.05; // Example 5% tax
  const total = subtotal + taxes;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-center text-gray-500 mt-4">Loading details...</p>
    </div>
  );
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 text-lg">{error}</p>
      <Link to="/" className="mt-4 inline-block bg-primary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400">
        Back to Home
      </Link>
    </div>
  );
  if (!experience) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Experience not found.</p>
      <Link to="/" className="mt-4 inline-block bg-primary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400">
        Back to Home
      </Link>
    </div>
  );

   const handleConfirm = () => {
    if (!experience || !selectedDate || !selectedTime) return;

    // Save the selections to the global context
    setBookingDetails({
      experience: experience,
      date: new Date(selectedDate.date).toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
      time: selectedTime.time,
      quantity: quantity,
    });
    
    // Navigate to the checkout page
    navigate('/checkout');
  };


  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} />
          Back to experiences
        </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column */}
        <div className="w-full lg:w-2/3">
          <img 
            src={experience.imageUrl} 
            alt={experience.title} 
            className="w-full rounded-lg shadow-lg mb-6"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
            }}
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{experience.title}</h1>
          <p className="text-gray-600 mb-6">{experience.description}</p>

          {/* Date Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Choose date</h2>
            <div className="flex gap-3">
              {experience.availableSlots.map((slot) => (
                <button
                  key={slot._id}
                  onClick={() => {
                    setSelectedDate(slot);
                    setSelectedTime(null); // Reset time selection
                  }}
                  className={`px-4 py-2 rounded-md border-2 ${selectedDate?._id === slot._id ? 'border-primary bg-yellow-100' : 'border-gray-300'}`}
                >
                  {formatDate(slot.date)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Choose time (IST)</h2>
              <div className="flex flex-wrap gap-3">
                {selectedDate.timeSlots
                  .sort((a, b) => {
                    // Sort time slots chronologically
                    const timeA = new Date(`2000-01-01 ${a.time}`).getTime();
                    const timeB = new Date(`2000-01-01 ${b.time}`).getTime();
                    return timeA - timeB;
                  })
                  .map((timeSlot) => (
                  <button
                    key={timeSlot._id}
                    onClick={() => setSelectedTime(timeSlot)}
                    disabled={timeSlot.spotsLeft === 0}
                    className={`px-4 py-2 rounded-md border-2 ${selectedTime?._id === timeSlot._id ? 'border-primary bg-yellow-100' : 'border-gray-300'} disabled:bg-gray-200 disabled:cursor-not-allowed`}
                  >
                    {timeSlot.time}
                    {timeSlot.spotsLeft === 0 ? ' (Sold Out)' : ` (${timeSlot.spotsLeft} left)`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Booking Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between"><span>Starts at</span><span className="font-semibold">₹{experience.price}</span></div>
              <div className="flex justify-between items-center">
                <span>Quantity</span>
                <div className="flex items-center gap-3 border rounded-md">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
                  <span className="font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))} 
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={quantity >= maxQuantity}
                  >+</button>
                </div>
              </div>
              {selectedTime && quantity >= maxQuantity && (
                <p className="text-sm text-orange-600">Maximum available: {maxQuantity}</p>
              )}
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes</span><span>₹{taxes.toFixed(2)}</span></div>
            </div>
            <div className="border-t my-4"></div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            {/* <button 
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-primary text-gray-900 font-bold py-3 rounded-lg mt-6 hover:bg-yellow-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm
            </button> */}
            <button 
              onClick={handleConfirm} // Add this handler
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-primary text-gray-900 font-bold py-3 rounded-lg mt-6 hover:bg-yellow-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default DetailsPage;