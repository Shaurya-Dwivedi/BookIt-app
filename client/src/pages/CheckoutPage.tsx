// client/src/pages/CheckoutPage.tsx
import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext.js';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

const CheckoutPage = () => {
  const { bookingDetails } = useBooking();
  
  useEffect(() => {
    document.title = 'Checkout - BookIt';
  }, []);
  const navigate = useNavigate();

  // Form State
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState<{ type: 'flat' | 'percentage', value: number } | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailError, setEmailError] = useState('');

  if (!bookingDetails.experience) {
    return <Navigate to="/" />;
  }

  // Price Calculation
  const subtotal = bookingDetails.experience.price * bookingDetails.quantity;
  const taxes = subtotal * 0.05;
  const discountAmount = discount
    ? discount.type === 'flat' ? discount.value : subtotal * (discount.value / 100)
    : 0;
  const total = subtotal + taxes - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
    
    // Validate email in real-time
    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  const handleApplyPromo = async () => {
    setError(''); // Clear any previous errors
    if (!promoCode.trim()) {
      setError('Please enter a promo code.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/api/promo/validate', { promoCode });
      if (res.data.isValid) {
        setDiscount(res.data.discount);
        setError('✓ Promo code applied successfully!');
      }
    } catch (err) {
      setError('Invalid promo code.');
      setDiscount(null);
    }
  };
  
  const handleConfirmBooking = async () => {
    if (!userInfo.name || !userInfo.email) {
        setError('Please fill in your name and email.');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userInfo.email)) {
        setError('Please enter a valid email address.');
        return;
    }
    
    if (!agreedToTerms) {
        setError('Please agree to the terms and safety policy.');
        return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
        const bookingPayload = {
            experienceId: bookingDetails.experience?._id,
            userName: userInfo.name,
            userEmail: userInfo.email,
            date: bookingDetails.date,
            time: bookingDetails.time,
            quantity: bookingDetails.quantity,
            totalPrice: total,
        };
        const res = await axios.post('http://localhost:3001/api/bookings', bookingPayload);
        
        // Clear booking details from localStorage after successful booking
        localStorage.removeItem('bookingDetails');
        
        // Navigate to a success/result page
        navigate(`/result?ref=${res.data.bookingRef}`);
    } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create booking. The slot might have been taken.');
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Form */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                value={userInfo.name} 
                onChange={handleInputChange} 
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={userInfo.email} 
                onChange={handleInputChange} 
                required
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Safety Policy</a> <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Promo code (optional)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())} 
                placeholder="Enter promo code" 
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm sm:text-sm"
              />
              <button 
                onClick={handleApplyPromo} 
                className="bg-gray-200 px-6 rounded-md text-sm font-semibold hover:bg-gray-300 whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Experience:</span><span className="font-semibold">{bookingDetails.experience.title}</span></div>
              <div className="flex justify-between"><span>Date:</span><span className="font-semibold">{bookingDetails.date}</span></div>
              <div className="flex justify-between"><span>Time:</span><span className="font-semibold">{bookingDetails.time} IST</span></div>
              <div className="flex justify-between"><span>Quantity:</span><span className="font-semibold">{bookingDetails.quantity} {bookingDetails.quantity > 1 ? 'tickets' : 'ticket'}</span></div>
              <hr className="my-2"/>
              <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes (5%):</span><span>₹{taxes.toFixed(2)}</span></div>
              {discount && <div className="flex justify-between text-green-600"><span>Discount:</span><span>- ₹{discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
            </div>
            {error && (
              <p className={`text-sm mt-4 ${error.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                {error}
              </p>
            )}
            <button 
              onClick={handleConfirmBooking} 
              disabled={isSubmitting || !agreedToTerms || !!emailError} 
              className="w-full bg-primary text-black font-bold py-3 mt-6 rounded-lg hover:bg-yellow-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default CheckoutPage;